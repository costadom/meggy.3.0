import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient.js';

const RefusalModal = ({ isOpen, onClose, modeloId, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (!reason.trim()) {
      toast({ title: "Atenção", description: "Por favor, informe o motivo da recusa.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await pb.collection('modelos').update(modeloId, {
        status_aprovacao: 'Recusada',
        motivo_recusa: reason
      }, { $autoCancel: false });
      
      toast({ title: "Sucesso", description: "Modelo recusada com sucesso." });
      onSuccess();
      onClose();
      setReason('');
    } catch (error) {
      console.error("Error refusing model:", error);
      toast({ title: "Erro", description: "Ocorreu um erro ao recusar a modelo.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#1F1F1F] border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-400">Recusar Modelo</DialogTitle>
          <DialogDescription className="text-gray-400">
            Informe o motivo da recusa. Esta mensagem poderá ser vista pela modelo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: Documento de identidade ilegível..."
            className="bg-black/20 border-white/10 text-white min-h-[120px]"
          />
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="border-white/10 text-white hover:bg-white/5 w-full sm:w-auto">
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Confirmar Recusa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefusalModal;