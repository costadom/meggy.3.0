import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

const AdminModelsApproved = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const records = await pb.collection('modelos').getFullList({
          filter: "status_aprovacao='Aprovada'",
          sort: '-created',
          $autoCancel: false
        });
        setModels(records);
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#D946EF]" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold">Modelos Aprovadas</h2>
      <Card className="bg-[#1F1F1F] border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="border-white/10 bg-black/20">
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-gray-400">Nome Artístico</TableHead>
                <TableHead className="text-gray-400">Email</TableHead>
                <TableHead className="text-gray-400">Preço/Hora</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">Nenhuma modelo aprovada.</TableCell>
                </TableRow>
              ) : (
                models.map(model => (
                  <TableRow key={model.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{model.nome_artistico}</TableCell>
                    <TableCell className="text-gray-300">{model.email}</TableCell>
                    <TableCell className="text-gray-300">{model.preco_hora} CR</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/20 text-green-400">Aprovada</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminModelsApproved;