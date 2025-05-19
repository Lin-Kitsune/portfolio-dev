import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = (pdfFonts as any).vfs;

const CAMPOS_EXCLUIDOS = ['peso'];

const COMPONENT_LABELS: Record<string, string> = {
  cpu: 'Procesador',
  gpu: 'Tarjeta Gráfica',
  motherboard: 'Placa Madre',
  ram: 'Memoria RAM',
  ssd: 'Unidad SSD',
  hdd: 'Disco Duro',
  psu: 'Fuente de Poder',
  case: 'Gabinete',
  cooler: 'Cooler',
  fans: 'Ventiladores'
};

export const generarPDFBuild = (build: any, total: number) => {
  const fecha = new Date().toLocaleDateString('es-CL');

  const componentesPorTipo = Object.entries(build)
    .filter(([, val]) => val && (Array.isArray(val) ? val.length : true))
    .map(([key, val]) => {
      const items = Array.isArray(val) ? val : [val];
      return {
        tipo: COMPONENT_LABELS[key] || key,
        items: items.map((item: any) => ({
          nombre: item.name,
          link: item.link || null,
          specs: item.specs || {}
        }))
      };
    });

  const content = [
    {
      stack: [
        {
          text: 'LINMAD - PIEZAS DE LA BUILD',
          style: 'title',
          alignment: 'center',
          margin: [0, 12, 0, 2]
        },
        {
          text: `Generado el ${fecha}`,
          style: 'subTitle',
          alignment: 'center',
          margin: [0, 0, 0, 0]
        }
      ],
      absolutePosition: { x: 40, y: 45 },
      width: 515
    },
    {
      text: '',
      margin: [0, 50, 0, 0]
    },
    ...componentesPorTipo.flatMap(({ tipo, items }) => [
      { text: tipo, style: 'componentTitle', margin: [0, 14, 0, 2] },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#5A32A3' }] },
      ...items.map(item => ({
        stack: [
          { text: item.nombre, style: 'tableBody', margin: [0, 6, 0, 0] },
          ...(item.link ? [{
            text: item.link,
            link: item.link,
            style: 'link',
            margin: [0, 2, 0, 2]
          }] : []),
          {
            table: {
                widths: ['40%', '*'],
                body: Object.entries(item.specs || {})
                .filter(([key]) => !CAMPOS_EXCLUIDOS.includes(key))
                .map(([k, v]) => {
                    const value = (v && typeof v === 'object' && !Array.isArray(v))
                    ? Object.entries(v).map(([subK, subV]) => `${subK}: ${subV ?? '-'}`).join(', ')
                    : (v ?? '-').toString();

                    return [
                    { text: k, bold: true, color: '#C2B9FF', style: 'tableCell' },
                    { text: value, style: 'tableCell' }
                    ];
                })
            },
            layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#5A32A3',
            vLineColor: () => '#5A32A3',
            paddingLeft: () => 4,
            paddingRight: () => 4,
            paddingTop: () => 2,
            paddingBottom: () => 2,
            },
            margin: [0, 4, 0, 10]
        }

        ]
      }))
    ]),
    {
      text: `Total estimado: $${total.toLocaleString('es-CL')}`,
      style: 'total'
    }
  ];

  const docDefinition: any = {
    pageMargins: [40, 60, 40, 60],
    background: () => [
      { // fondo negro
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 595.28,
            h: 841.89,
            color: '#0D0D0D'
          }
        ]
      },
    ],
    content,
    styles: {
      title: {
        fontSize: 22,
        bold: true,
        color: '#5A32A3'
      },
      subTitle: {
        fontSize: 12,
        color: '#F4F4F5'
      },
      componentTitle: {
        fontSize: 13,
        bold: true,
        color: '#00FFFF'
      },
      tableBody: {
        color: '#F4F4F5',
        fontSize: 11,
        bold: true
      },
      specs: {
        fontSize: 9,
        color: '#F4F4F5'
      },
      total: {
        fontSize: 14,
        bold: true,
        alignment: 'right',
        color: '#00FFFF',
        margin: [0, 10, 0, 0]
      },
      link: {
        color: '#00FFFF',
        decoration: 'underline',
        fontSize: 9
      },
      tableCell: {
        fontSize: 9,
        color: '#F4F4F5'
      }
    },
    footer: function (currentPage: number, pageCount: number) {
      return {
        columns: [
          { text: 'Build by LinMad', alignment: 'left', margin: [40, 0], color: '#C2B9FF' },
          { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', margin: [0, 0, 40, 0], color: '#C2B9FF' }
        ],
        fontSize: 9
      };
    }
  };

  pdfMake.createPdf(docDefinition).open();
};
