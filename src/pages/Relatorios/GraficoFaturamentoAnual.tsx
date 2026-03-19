import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type TooltipItem
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface Props {
  // O total vem do BigDecimal do Java, garantimos que o front saiba lidar
  dados: { mes: number; total: number | string }[];
}

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export function GraficoFaturamentoAnual({ dados }: Props) {

  // Como o backend já envia o total somado dos finalizados por mês, 
  // apenas mapeamos para as posições corretas do gráfico.
  const valores = meses.map((_, index) => {
    const mesAtual = index + 1;
    const item = dados.find(d => d.mes === mesAtual);
    // Convertemos para Number caso o BigDecimal venha como string no JSON
    return item ? Number(item.total) : 0;
  });

  const data = {
    labels: meses,
    datasets: [
      {
        label: "Faturamento Finalizado (R$)",
        data: valores,
        borderRadius: 6,
        backgroundColor: "#2e7d32",
        datalabels: {
          anchor: 'end' as const,
          align: 'top' as const,
          offset: 4,
          color: "#444",
          font: {
            weight: 'bold' as const,
            size: 11
          },
          formatter: (value: number) => {
            return value > 0 
              ? value.toLocaleString("pt-BR", { 
                  style: "currency", 
                  currency: "BRL", 
                  maximumFractionDigits: 0 
                }) 
              : ""; 
          }
        }
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 35 
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grace: "15%", 
        ticks: {
          // Formatação do eixo Y
          callback: (value: any) => 
            value.toLocaleString("pt-BR", { 
              style: "currency", 
              currency: "BRL", 
              maximumFractionDigits: 0 
            })
        }
      }
    },
    plugins: {
      datalabels: {
        display: true 
      },
      legend: {
        display: true
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<'bar'>): string => 
            `Total: R$ ${(ctx.raw as number).toLocaleString("pt-BR")}`
        }
      }
    }
  };

  return (
    <div style={{ height: 350 }}>
      <Bar data={data} options={options as any} />
    </div>
  );
}