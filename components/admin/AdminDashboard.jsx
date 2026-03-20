import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Gamepad2, Clock, Calendar, TrendingUp, Loader2, Globe } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalModelos: 0,
    modelosAnalise: 0,
    modelosPublicadas: 0,
    agendamentosTotal: 0,
    creditosVendidos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const clientesRes = await pb.collection('clientes').getList(1, 1, {
          $autoCancel: false,
        });

        const modelosRes = await pb.collection('modelos').getList(1, 1, {
          $autoCancel: false,
        });

        const analiseRes = await pb.collection('modelos').getList(1, 1, {
          filter: 'status_aprovacao="Em análise"',
          $autoCancel: false,
        });

        const publicadasRes = await pb.collection('modelos').getList(1, 1, {
          filter: 'status_aprovacao="Publicada"',
          $autoCancel: false,
        });

        const agendamentosRes = await pb.collection('agendamentos').getList(1, 1, {
          $autoCancel: false,
        });

        const creditosRes = await pb.collection('creditos').getFullList({
          filter: 'tipo="Recarga"',
          $autoCancel: false,
        });

        const vendidos = Array.isArray(creditosRes)
          ? creditosRes.reduce((acc, curr) => acc + (Number(curr.quantidade) || 0), 0)
          : 0;

        setStats({
          totalClientes: clientesRes.totalItems || 0,
          totalModelos: modelosRes.totalItems || 0,
          modelosAnalise: analiseRes.totalItems || 0,
          modelosPublicadas: publicadasRes.totalItems || 0,
          agendamentosTotal: agendamentosRes.totalItems || 0,
          creditosVendidos: vendidos,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#D946EF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">Visão Geral</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-[#1F1F1F] border-white/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Clientes</p>
              <h3 className="text-2xl font-bold text-white">{stats.totalClientes}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1F1F1F] border-white/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-[#D946EF]/20 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-[#D946EF]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Modelos</p>
              <h3 className="text-2xl font-bold text-white">{stats.totalModelos}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1F1F1F] border-white/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Modelos em Análise</p>
              <h3 className="text-2xl font-bold text-white">{stats.modelosAnalise}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1F1F1F] border-white/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Globe className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Modelos Publicadas</p>
              <h3 className="text-2xl font-bold text-white">{stats.modelosPublicadas}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1F1F1F] border-white/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Agendamentos</p>
              <h3 className="text-2xl font-bold text-white">{stats.agendamentosTotal}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1F1F1F] border-white/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Créditos Vendidos</p>
              <h3 className="text-2xl font-bold text-white">{stats.creditosVendidos}</h3>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;