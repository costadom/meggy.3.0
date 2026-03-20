import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient.js';

const AddCreditsModal = ({ isOpen, onClose, client, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({ title: "Atenção", description: "Insira um valor válido maior que zero.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Update client balance
      const newBalance = (client.saldo_creditos || 0) + numAmount;
      await pb.collection('clientes').update(client.id, {
        saldo_creditos: newBalance
      }, { $autoCancel: false });

      // Create credit record
      await pb.collection('creditos').create({
        usuario_id: client.id,
        tipo: 'Recarga',
        quantidade: numAmount,
        descricao: 'Créditos adicionados pelo admin',
        status: 'Concluido'
      }, { $autoCancel: false });
      
      toast({ title: "Sucesso", description: `${numAmount} créditos adicionados com sucesso.` });
      onSuccess();
      onClose();
      setAmount('');
    } catch (error) {
      console.error("Error adding credits:", error);
      toast({ title: "Erro", description: "Ocorreu um erro ao adicionar créditos.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#1F1F1F] border-white/10 text-white sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-400">Adicionar Créditos</DialogTitle>
          <DialogDescription className="text-gray-400">
            Adicionar créditos manualmente para {client?.nome_completo}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Quantidade de Créditos</Label>
            <Input 
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 100"
              className="bg-black/20 border-white/10 text-white text-lg"
            />
          </div>
          <div className="text-sm text-gray-400">
            Saldo atual: <span className="font-bold text-white">{client?.saldo_creditos || 0} CR</span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="border-white/10 text-white hover:bg-white/5 w-full sm:w-auto">
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCreditsModal;