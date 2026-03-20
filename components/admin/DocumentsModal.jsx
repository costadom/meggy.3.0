import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient.js';

const DocumentsModal = ({ isOpen, onClose, modeloId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && modeloId) {
      fetchDocuments();
    }
  }, [isOpen, modeloId]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('documentos').getFullList({
        filter: `modelo_id = "${modeloId}"`,
        sort: '-created',
        $autoCancel: false
      });
      setDocuments(records);
    } catch (error) {
      console.error("Error fetching documents:", error);
      // Don't show error toast if collection just doesn't exist yet or is empty
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (docId) => {
    setActionLoading(docId);
    try {
      await pb.collection('documentos').update(docId, {
        status_verificacao: 'Verificado'
      }, { $autoCancel: false });
      toast({ title: "Sucesso", description: "Documento verificado." });
      fetchDocuments();
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao verificar documento.", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (docId) => {
    setActionLoading(docId);
    try {
      await pb.collection('documentos').update(docId, {
        status_verificacao: 'Rejeitado'
      }, { $autoCancel: false });
      toast({ title: "Sucesso", description: "Documento rejeitado." });
      fetchDocuments();
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao rejeitar documento.", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#1F1F1F] border-white/10 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Documentos da Modelo</DialogTitle>
          <DialogDescription className="text-gray-400">
            Verifique a identidade e fotos enviadas.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#D946EF]" /></div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Nenhum documento encontrado para esta modelo.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {documents.map(doc => (
              <div key={doc.id} className="bg-black/20 border border-white/10 rounded-xl p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg capitalize">{doc.tipo || 'Documento'}</h4>
                  <Badge className={
                    doc.status_verificacao === 'Verificado' ? 'bg-green-500/20 text-green-400' :
                    doc.status_verificacao === 'Rejeitado' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-500'
                  }>
                    {doc.status_verificacao || 'Pendente'}
                  </Badge>
                </div>
                
                <div className="flex-1 bg-black/40 rounded-lg overflow-hidden mb-4 flex items-center justify-center min-h-[200px]">
                  {doc.arquivo ? (
                    <img 
                      src={pb.files.getUrl(doc, doc.arquivo)} 
                      alt={doc.tipo} 
                      className="max-w-full max-h-[300px] object-contain"
                    />
                  ) : (
                    <span className="text-gray-500">Sem arquivo</span>
                  )}
                </div>

                <div className="flex gap-2 mt-auto">
                  <Button 
                    onClick={() => handleVerify(doc.id)}
                    disabled={actionLoading === doc.id || doc.status_verificacao === 'Verificado'}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    {actionLoading === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Verificar
                  </Button>
                  <Button 
                    onClick={() => handleReject(doc.id)}
                    disabled={actionLoading === doc.id || doc.status_verificacao === 'Rejeitado'}
                    variant="outline"
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    {actionLoading === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                    Rejeitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="border-white/10 text-white hover:bg-white/5">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentsModal;