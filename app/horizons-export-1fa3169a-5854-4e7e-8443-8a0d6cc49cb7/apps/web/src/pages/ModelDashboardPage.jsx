import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Calendar as CalendarIcon, DollarSign, LogOut, Menu, X, CheckCircle2, Loader2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { AgendamentoService } from '@/services/AgendamentoService.js';
import ScheduleCalendar from '@/components/ScheduleCalendar.jsx';
import { useToast } from '@/hooks/use-toast';

const ModelDashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentUser, logout, refreshUser } = useAuth();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const fetchData = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    setError(null);
    try {
      const bookingsRes = await pb.collection('agendamentos').getFullList({
        filter: `modelo_id = "${currentUser.id}"`,
        sort: '-data_agendamento',
        expand: 'cliente_id',
        $autoCancel: false
      });
      setBookings(bookingsRes || []);
      await refreshUser();
    } catch (err) {
      console.error("Error fetching model data:", err);
      setError("Não foi possível carregar os dados do painel. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchData();
    }
  }, [currentUser?.id]);

  const handleConfirm = async (id) => {
    setActionLoading(id);
    try {
      await AgendamentoService.confirmAgendamento(id);
      toast({ title: "Sucesso", description: "Reserva confirmada!" });
      await fetchData();
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefuse = async (id) => {
    if (!window.confirm('Tem certeza que deseja recusar esta reserva?')) return;
    setActionLoading(id);
    try {
      await AgendamentoService.refuseAgendamento(id);
      toast({ title: "Sucesso", description: "Reserva recusada e créditos devolvidos." });
      await fetchData();
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id) => {
    if (!window.confirm('Marcar esta sessão como concluída? Os créditos serão adicionados ao seu saldo.')) return;
    setActionLoading(id);
    try {
      await AgendamentoService.markAsCompleted(id, currentUser.id);
      toast({ title: "Sucesso", description: "Sessão concluída! Ganhos adicionados." });
      await fetchData();
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'Pendente');
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmado');
  const pastBookings = bookings.filter(b => b.status === 'Concluido');

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Reservas' },
    { id: 'agenda', icon: CalendarIcon, label: 'Minha Agenda' },
    { id: 'ganhos', icon: DollarSign, label: 'Meus Ganhos' },
  ];

  if (!currentUser) return null;

  if (currentUser.status_aprovacao !== 'Publicada' && currentUser.status_aprovacao !== 'Aprovada') {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center p-4">
        <Card className="bg-[#1F1F1F] border-white/10 max-w-md w-full text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Status: {currentUser.status_aprovacao}</h2>
          <p className="text-gray-400 mb-6">
            {currentUser.status_aprovacao === 'Em análise' 
              ? 'Seu perfil está em análise pela nossa equipe. Você terá acesso ao painel assim que for aprovada.'
              : 'Seu perfil foi recusado. Entre em contato com o suporte para mais informações.'}
          </p>
          <Button onClick={logout} variant="outline" className="border-white/20 text-white">Sair</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex">
      <Helmet>
        <title>Painel da Modelo | Meggy</title>
      </Helmet>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={toggleSidebar} />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#1F1F1F] border-r border-white/10 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <Link to="/" className="flex flex-col">
            <span className="text-2xl font-bold text-[#D946EF] tracking-tighter">MEGGY</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest -mt-1">Model Panel</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden text-gray-400" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left
                ${activeTab === item.id 
                  ? 'bg-[#D946EF]/10 text-[#D946EF] font-medium' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 w-full text-left">
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-white/10 bg-[#1F1F1F]/50 backdrop-blur flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden text-white" onClick={toggleSidebar}>
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Bem-vinda, {currentUser?.nome_artistico || 'Modelo'}! ✨</h1>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-none hidden sm:flex">
            <CheckCircle2 className="w-3 h-3 mr-1" /> {currentUser?.status_aprovacao}
          </Badge>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#D946EF]" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Ops! Algo deu errado.</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <Button onClick={fetchData} variant="outline" className="border-white/20 text-white">Tentar Novamente</Button>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in">
                  
                  {/* Pending Bookings */}
                  <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Clock className="w-6 h-6 text-yellow-500" />
                      Reservas Recebidas (Pendentes)
                    </h2>
                    {pendingBookings.length === 0 ? (
                      <Card className="bg-[#1F1F1F] border-white/10">
                        <CardContent className="p-8 text-center text-gray-400">
                          Nenhuma reserva pendente no momento.
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingBookings.map(booking => (
                          <Card key={booking.id} className="bg-[#1F1F1F] border-white/10 border-l-4 border-l-yellow-500">
                            <CardContent className="p-5">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-bold text-white text-lg">{booking.expand?.cliente_id?.nome_completo || 'Cliente'}</h4>
                                  <p className="text-sm text-gray-400">
                                    {new Date(booking.data_agendamento).toLocaleDateString()} • {booking.hora_inicio} - {booking.hora_fim}
                                  </p>
                                </div>
                                <Badge className="bg-yellow-500/20 text-yellow-500">Pendente</Badge>
                              </div>
                              <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                <Button 
                                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                                  onClick={() => handleConfirm(booking.id)}
                                  disabled={actionLoading === booking.id}
                                >
                                  {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                  Confirmar
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                                  onClick={() => handleRefuse(booking.id)}
                                  disabled={actionLoading === booking.id}
                                >
                                  Recusar
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Confirmed Bookings */}
                  <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                      Próximos Agendamentos (Confirmados)
                    </h2>
                    {confirmedBookings.length === 0 ? (
                      <Card className="bg-[#1F1F1F] border-white/10">
                        <CardContent className="p-8 text-center text-gray-400">
                          Nenhum agendamento confirmado.
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {confirmedBookings.map(booking => (
                          <Card key={booking.id} className="bg-[#1F1F1F] border-white/10 border-l-4 border-l-green-500">
                            <CardContent className="p-5">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-bold text-white text-lg">{booking.expand?.cliente_id?.nome_completo || 'Cliente'}</h4>
                                  <p className="text-sm text-gray-400">
                                    {new Date(booking.data_agendamento).toLocaleDateString()} • {booking.hora_inicio} - {booking.hora_fim}
                                  </p>
                                </div>
                                <Badge className="bg-green-500/20 text-green-400">Confirmado</Badge>
                              </div>
                              <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                <Button 
                                  className="w-full bg-[#D946EF] hover:bg-[#c026d3] text-white"
                                  onClick={() => handleComplete(booking.id)}
                                  disabled={actionLoading === booking.id}
                                >
                                  {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                  Marcar como Concluído
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              )}

              {activeTab === 'agenda' && (
                <div className="space-y-6 animate-in fade-in max-w-4xl">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-2">Gerenciar Disponibilidade</h2>
                    <p className="text-gray-400">Clique nos horários para alternar entre Livre e Bloqueado. Horários ocupados por reservas não podem ser alterados.</p>
                  </div>
                  <ScheduleCalendar modeloId={currentUser.id} viewMode="model" />
                </div>
              )}

              {activeTab === 'ganhos' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-[#1F1F1F] border-white/10">
                      <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                        <p className="text-gray-400 text-sm font-medium mb-2">Ganhos Totais</p>
                        <h3 className="text-5xl font-bold text-green-400 mb-2">R$ {currentUser?.ganhos_totais || 0}</h3>
                        <p className="text-sm text-gray-500">Disponível para saque</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#1F1F1F] border-white/10">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4">Resumo de Sessões</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                            <span className="text-gray-400">Sessões Concluídas</span>
                            <span className="text-white font-bold">{pastBookings.length}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                            <span className="text-gray-400">Valor por Hora</span>
                            <span className="text-[#D946EF] font-bold">R$ {currentUser?.preco_hora || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <h2 className="text-2xl font-bold">Histórico de Ganhos</h2>
                  <Card className="bg-[#1F1F1F] border-white/10">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader className="border-white/10 bg-black/20">
                          <TableRow className="hover:bg-transparent border-white/10">
                            <TableHead className="text-gray-400">Data</TableHead>
                            <TableHead className="text-gray-400">Cliente</TableHead>
                            <TableHead className="text-gray-400">Duração</TableHead>
                            <TableHead className="text-right text-gray-400">Valor Ganho</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pastBookings.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-gray-500 py-8">Nenhum ganho registrado ainda.</TableCell>
                            </TableRow>
                          ) : (
                            pastBookings.map(booking => (
                              <TableRow key={booking.id} className="border-white/10 hover:bg-white/5">
                                <TableCell className="text-gray-300">{new Date(booking.data_agendamento).toLocaleDateString()}</TableCell>
                                <TableCell className="text-white font-medium">{booking.expand?.cliente_id?.nome_completo || 'Cliente'}</TableCell>
                                <TableCell className="text-gray-300">{booking.duracao_minutos} min</TableCell>
                                <TableCell className="text-right text-green-400 font-bold">+ R$ {booking.creditos_gastos}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ModelDashboardPage;