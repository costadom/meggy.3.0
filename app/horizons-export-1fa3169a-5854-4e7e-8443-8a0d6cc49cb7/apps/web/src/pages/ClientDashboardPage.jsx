import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  CreditCard,
  History,
  LogOut,
  Menu,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { AgendamentoService } from '@/services/AgendamentoService.js';
import { CreditService } from '@/services/CreditService.js';
import { useToast } from '@/hooks/use-toast';

const ClientDashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const { currentUser, logout, refreshUser } = useAuth();
  const { toast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [creditsHistory, setCreditsHistory] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const [historyFilter, setHistoryFilter] = useState('all');

  const [bookingForm, setBookingForm] = useState({
    modeloId: '',
    data: '',
    horaInicio: '',
    duracaoMinutos: '60',
  });

  const isPaymentSuccess = searchParams.get('payment') === 'success';
  const [latestRecharge, setLatestRecharge] = useState(null);
  const [fetchingRecharge, setFetchingRecharge] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const selectedModel = availableModels.find((m) => m.id === bookingForm.modeloId);
  const bookingCredits = selectedModel ? Number(selectedModel.preco_hora || 0) : 0;

  const fetchData = async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    setError(null);

    try {
      let hasAnySuccess = false;

      try {
        const bookingsRes = await pb.collection('agendamentos').getFullList({
          filter: `cliente_id="${currentUser.id}"`,
          sort: '-data_agendamento',
          expand: 'modelo_id',
          $autoCancel: false,
        });
        setBookings(bookingsRes || []);
        hasAnySuccess = true;
      } catch (err) {
        console.error('Erro ao buscar agendamentos:', err);
        setBookings([]);
      }

      try {
        const creditsRes = await CreditService.getCreditHistory(currentUser.id);
        setCreditsHistory(creditsRes || []);
        hasAnySuccess = true;
      } catch (err) {
        console.error('Erro ao buscar histórico de créditos:', err);
        setCreditsHistory([]);
      }

      try {
        const modelsRes = await pb.collection('modelos').getFullList({
          filter: 'status_aprovacao="Publicada"',
          sort: '-created',
          $autoCancel: false,
        });
        setAvailableModels(modelsRes || []);
        hasAnySuccess = true;
      } catch (err) {
        console.error('Erro ao buscar modelos publicadas:', err);
        setAvailableModels([]);
      }

      try {
        await refreshUser();
      } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
      }

      if (!hasAnySuccess) {
        setError('Não foi possível carregar os dados do painel. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchData();
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (location.state?.openBooking) {
      setActiveTab('nova-reserva');

      if (location.state?.selectedModelId) {
        setBookingForm((prev) => ({
          ...prev,
          modeloId: location.state.selectedModelId,
        }));
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (isPaymentSuccess && currentUser?.id) {
      const fetchLatestRecharge = async () => {
        setFetchingRecharge(true);
        try {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          await refreshUser();

          const latest = await pb.collection('creditos').getFirstListItem(
            `usuario_id="${currentUser.id}" && tipo="Recarga"`,
            { sort: '-created', $autoCancel: false }
          );
          setLatestRecharge(latest);
        } catch (error) {
          console.error('Error fetching latest recharge:', error);
        } finally {
          setFetchingRecharge(false);
        }
      };

      fetchLatestRecharge();
    }
  }, [isPaymentSuccess, currentUser?.id]);

  const handleCancelBooking = async (agendamentoId) => {
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return;

    setActionLoading(agendamentoId);
    try {
      await AgendamentoService.cancelAgendamento(agendamentoId, currentUser.id);
      toast({
        title: 'Sucesso',
        description: 'Agendamento cancelado e créditos reembolsados.',
      });
      await fetchData();
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateBooking = async () => {
    if (!bookingForm.modeloId || !bookingForm.data || !bookingForm.horaInicio || !bookingForm.duracaoMinutos) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha modelo, data, horário e duração.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedModel) {
      toast({
        title: 'Modelo inválida',
        description: 'Selecione uma modelo válida.',
        variant: 'destructive',
      });
      return;
    }

    const creditosNecessarios = Number(selectedModel.preco_hora || 0);

    if ((currentUser?.saldo_creditos || 0) < creditosNecessarios) {
      toast({
        title: 'Créditos insuficientes',
        description: 'Você não possui créditos suficientes para essa reserva.',
        variant: 'destructive',
      });
      navigate('/recarregar-creditos');
      return;
    }

    setActionLoading('create-booking');

    try {
      await AgendamentoService.createAgendamento(
        currentUser.id,
        bookingForm.modeloId,
        bookingForm.data,
        bookingForm.horaInicio,
        Number(bookingForm.duracaoMinutos),
        creditosNecessarios
      );

      toast({
        title: 'Reserva criada',
        description: 'Seu agendamento foi enviado com sucesso.',
      });

      setBookingForm({
        modeloId: '',
        data: '',
        horaInicio: '',
        duracaoMinutos: '60',
      });

      await fetchData();
      setActiveTab('dashboard');
      navigate('/dashboard/cliente', { replace: true, state: {} });
    } catch (error) {
      toast({
        title: 'Erro ao agendar',
        description: error.message || 'Não foi possível criar a reserva.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const upcomingBookings = bookings.filter((b) => b.status === 'Pendente' || b.status === 'Confirmado');

  let pastBookings = bookings.filter((b) => b.status === 'Concluido' || b.status === 'Cancelado');

  if (historyFilter === '7days') {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    pastBookings = pastBookings.filter((b) => new Date(b.data_agendamento) >= sevenDaysAgo);
  } else if (historyFilter === '30days') {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    pastBookings = pastBookings.filter((b) => new Date(b.data_agendamento) >= thirtyDaysAgo);
  }

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Próximos Agendamentos' },
    { id: 'nova-reserva', icon: PlusCircle, label: 'Nova Reserva' },
    { id: 'agendamentos', icon: History, label: 'Histórico de Sessões' },
    { id: 'creditos', icon: CreditCard, label: 'Saldo e Créditos' },
  ];

  if (!currentUser) return null;

  if (isPaymentSuccess) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-4">
        <Helmet>
          <title>Pagamento Aprovado | Meggy</title>
        </Helmet>

        <div className="max-w-md w-full bg-[#1F1F1F] border border-white/10 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-500 shadow-2xl shadow-[#D946EF]/10">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl md:text-3xl font-bold mb-2">✅ Pagamento realizado com sucesso!</h1>
          <p className="text-gray-400 mb-8">Seus créditos já estão disponíveis na sua conta.</p>

          <div className="bg-black/30 rounded-xl p-6 mb-8 border border-white/5">
            {fetchingRecharge ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#D946EF] mb-2" />
                <span className="text-sm text-gray-400">Atualizando saldo...</span>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-1">Créditos Adicionados</p>
                <p className="text-4xl font-bold text-green-400 mb-4">
                  +{latestRecharge?.quantidade || 0} <span className="text-xl">CR</span>
                </p>
                <div className="h-px w-full bg-white/10 my-4" />
                <p className="text-sm text-gray-400 mb-1">Saldo Atual Total</p>
                <p className="text-3xl font-bold text-[#D946EF]">
                  {currentUser?.saldo_creditos || 0} <span className="text-lg">CR</span>
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                setSearchParams({});
                setActiveTab('dashboard');
              }}
              className="w-full bg-[#D946EF] hover:bg-[#c026d3] text-white py-6 text-lg"
            >
              Voltar ao Dashboard
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/recarregar-creditos')}
              className="w-full border-white/20 text-white hover:bg-white/10 py-6 text-lg"
            >
              Comprar Mais Créditos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex">
      <Helmet>
        <title>Meu Painel | Meggy</title>
      </Helmet>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#1F1F1F] border-r border-white/10 
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <Link to="/" className="flex flex-col">
            <span className="text-2xl font-bold text-[#D946EF] tracking-tighter">MEGGY</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest -mt-1">Client Panel</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-400"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left
                ${
                  activeTab === item.id
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
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-white/10 bg-[#1F1F1F]/50 backdrop-blur flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </Button>

            <h1 className="text-xl font-bold">
              Olá, {currentUser?.nome_completo?.split(' ')[0] || 'Cliente'}!
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full border border-white/10">
            <span className="text-sm text-gray-400">Saldo:</span>
            <span className="font-bold text-[#D946EF]">{currentUser?.saldo_creditos || 0} CR</span>
          </div>
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
              <Button onClick={fetchData} variant="outline" className="border-white/20 text-white">
                Tentar Novamente
              </Button>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Próximos Agendamentos</h2>
                    <Button
                      onClick={() => setActiveTab('nova-reserva')}
                      className="bg-[#D946EF] hover:bg-[#c026d3] text-white"
                    >
                      Nova Reserva
                    </Button>
                  </div>

                  {upcomingBookings.length === 0 ? (
                    <Card className="bg-[#1F1F1F] border-white/10">
                      <CardContent className="p-12 text-center text-gray-400">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg mb-2">Nenhum agendamento futuro.</p>
                        <button
                          onClick={() => setActiveTab('nova-reserva')}
                          className="text-[#D946EF] hover:underline"
                        >
                          Criar nova reserva
                        </button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {upcomingBookings.map((booking) => (
                        <Card
                          key={booking.id}
                          className="bg-[#1F1F1F] border-white/10 border-l-4 border-l-[#D946EF]"
                        >
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-black/50 overflow-hidden border border-white/10">
                                  {booking.expand?.modelo_id?.foto_perfil_arquivo ? (
                                    <img
                                      src={pb.files.getUrl(
                                        booking.expand.modelo_id,
                                        booking.expand.modelo_id.foto_perfil_arquivo
                                      )}
                                      alt="Modelo"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                      M
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <h4 className="font-bold text-white text-lg">
                                    {booking.expand?.modelo_id?.nome_artistico || 'Modelo'}
                                  </h4>
                                  <p className="text-sm text-gray-400">
                                    {new Date(booking.data_agendamento).toLocaleDateString()} •{' '}
                                    {booking.hora_inicio} - {booking.hora_fim}
                                  </p>
                                </div>
                              </div>

                              <Badge
                                className={
                                  booking.status === 'Confirmado'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-yellow-500/20 text-yellow-500'
                                }
                              >
                                {booking.status}
                              </Badge>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={actionLoading === booking.id}
                              >
                                {actionLoading === booking.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                Cancelar Reserva
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'nova-reserva' && (
                <div className="space-y-6 animate-in fade-in max-w-3xl">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Nova Reserva</h2>
                    <p className="text-gray-400">
                      Escolha a modelo, a data e o horário para solicitar sua sessão.
                    </p>
                  </div>

                  <Card className="bg-[#1F1F1F] border-white/10">
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Modelo</label>
                          <Select
                            value={bookingForm.modeloId}
                            onValueChange={(value) =>
                              setBookingForm((prev) => ({ ...prev, modeloId: value }))
                            }
                          >
                            <SelectTrigger className="bg-black/30 border-white/10 text-white">
                              <SelectValue placeholder="Selecione a modelo" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1F1F1F] border-white/10 text-white">
                              {availableModels.map((model) => (
                                <SelectItem key={model.id} value={model.id}>
                                  {model.nome_artistico}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Data</label>
                          <input
                            type="date"
                            value={bookingForm.data}
                            onChange={(e) =>
                              setBookingForm((prev) => ({ ...prev, data: e.target.value }))
                            }
                            className="w-full h-10 rounded-md bg-black/30 border border-white/10 px-3 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Horário</label>
                          <input
                            type="time"
                            value={bookingForm.horaInicio}
                            onChange={(e) =>
                              setBookingForm((prev) => ({ ...prev, horaInicio: e.target.value }))
                            }
                            className="w-full h-10 rounded-md bg-black/30 border border-white/10 px-3 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Duração</label>
                          <Select
                            value={bookingForm.duracaoMinutos}
                            onValueChange={(value) =>
                              setBookingForm((prev) => ({ ...prev, duracaoMinutos: value }))
                            }
                          >
                            <SelectTrigger className="bg-black/30 border-white/10 text-white">
                              <SelectValue placeholder="Duração" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1F1F1F] border-white/10 text-white">
                              <SelectItem value="60">60 minutos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                        <p className="text-sm text-gray-400 mb-2">Resumo da reserva</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Modelo</span>
                            <span className="text-white">{selectedModel?.nome_artistico || '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Créditos necessários</span>
                            <span className="text-[#D946EF] font-bold">{bookingCredits} CR</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Seu saldo atual</span>
                            <span className="text-white">{currentUser?.saldo_creditos || 0} CR</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-3">
                        <Button
                          onClick={handleCreateBooking}
                          disabled={actionLoading === 'create-booking'}
                          className="bg-[#D946EF] hover:bg-[#c026d3] text-white"
                        >
                          {actionLoading === 'create-booking' ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : null}
                          Confirmar Agendamento
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => setActiveTab('dashboard')}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'agendamentos' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Histórico de Sessões</h2>

                    <Select value={historyFilter} onValueChange={setHistoryFilter}>
                      <SelectTrigger className="w-[180px] bg-[#1F1F1F] border-white/10 text-white">
                        <SelectValue placeholder="Período" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1F1F1F] border-white/10 text-white">
                        <SelectItem value="all">Todo o período</SelectItem>
                        <SelectItem value="30days">Últimos 30 dias</SelectItem>
                        <SelectItem value="7days">Últimos 7 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Card className="bg-[#1F1F1F] border-white/10">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader className="border-white/10 bg-black/20">
                          <TableRow className="hover:bg-transparent border-white/10">
                            <TableHead className="text-gray-400">Data</TableHead>
                            <TableHead className="text-gray-400">Modelo</TableHead>
                            <TableHead className="text-gray-400">Duração</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {pastBookings.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                                Nenhum histórico encontrado para este período.
                              </TableCell>
                            </TableRow>
                          ) : (
                            pastBookings.map((booking) => (
                              <TableRow key={booking.id} className="border-white/10 hover:bg-white/5">
                                <TableCell className="text-gray-300">
                                  {new Date(booking.data_agendamento).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-white font-medium">
                                  {booking.expand?.modelo_id?.nome_artistico || 'Modelo'}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  {booking.duracao_minutos} min
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      booking.status === 'Concluido'
                                        ? 'bg-blue-500/20 text-blue-400'
                                        : 'bg-red-500/20 text-red-400'
                                    }
                                  >
                                    {booking.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'creditos' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-[#1F1F1F] border-white/10">
                      <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                        <p className="text-gray-400 text-sm font-medium mb-2">Saldo Atual</p>
                        <h3 className="text-5xl font-bold text-[#D946EF] mb-6">
                          {currentUser?.saldo_creditos || 0} <span className="text-2xl text-gray-400">CR</span>
                        </h3>
                        <Button asChild className="w-full bg-green-500 hover:bg-green-600 text-white">
                          <Link to="/recarregar-creditos">Recarregar Créditos</Link>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#1F1F1F] border-white/10">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4">Resumo</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                            <span className="text-gray-400">Total Recarregado</span>
                            <span className="text-green-400 font-bold">
                              {creditsHistory
                                .filter((c) => c.tipo === 'Recarga')
                                .reduce((acc, curr) => acc + curr.quantidade, 0)}{' '}
                              CR
                            </span>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                            <span className="text-gray-400">Total Gasto</span>
                            <span className="text-red-400 font-bold">
                              {creditsHistory
                                .filter((c) => c.tipo === 'Consumo')
                                .reduce((acc, curr) => acc + curr.quantidade, 0)}{' '}
                              CR
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <h2 className="text-2xl font-bold">Histórico de Transações</h2>

                  <Card className="bg-[#1F1F1F] border-white/10">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader className="border-white/10 bg-black/20">
                          <TableRow className="hover:bg-transparent border-white/10">
                            <TableHead className="text-gray-400">Data</TableHead>
                            <TableHead className="text-gray-400">Tipo</TableHead>
                            <TableHead className="text-gray-400">Descrição</TableHead>
                            <TableHead className="text-right text-gray-400">Valor</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {creditsHistory.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                                Nenhuma transação encontrada.
                              </TableCell>
                            </TableRow>
                          ) : (
                            creditsHistory.map((tx) => (
                              <TableRow key={tx.id} className="border-white/10 hover:bg-white/5">
                                <TableCell className="text-gray-300">
                                  {new Date(tx.created).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      tx.tipo === 'Recarga'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-orange-500/20 text-orange-400'
                                    }
                                  >
                                    {tx.tipo}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-gray-300">{tx.descricao || '-'}</TableCell>
                                <TableCell
                                  className={`text-right font-bold ${
                                    tx.tipo === 'Recarga' ? 'text-green-400' : 'text-orange-400'
                                  }`}
                                >
                                  {tx.tipo === 'Recarga' ? '+' : '-'}
                                  {tx.quantidade} CR
                                </TableCell>
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

export default ClientDashboardPage;