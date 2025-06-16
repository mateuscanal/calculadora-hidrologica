const express = require('express');
const cors = require('cors');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = require('docx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// formatar data
function formatDate() {
    const date = new Date();
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 
                   'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

// gerar memorial
app.post('/api/generate-memorial', async (req, res) => {
    try {
        const { formData, results } = req.body;

        // Criar documento
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: "MEMORIAL DE CÁLCULO HIDROLÓGICO",
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 }
                    }),

                    new Paragraph({
                        text: formatDate(),
                        alignment: AlignmentType.RIGHT,
                        spacing: { after: 400 }
                    }),

                    new Paragraph({
                        text: "1. DADOS DE ENTRADA",
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 400, after: 200 }
                    }),

                    new Paragraph({
                        text: "1.1. Parâmetros da Equação IDF",
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 200, after: 100 }
                    }),

                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ text: "Parâmetro", bold: true })],
                                        width: { size: 50, type: WidthType.PERCENTAGE }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: "Valor", bold: true })],
                                        width: { size: 50, type: WidthType.PERCENTAGE }
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("K")] }),
                                    new TableCell({ children: [new Paragraph(formData.k.toString())] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("a")] }),
                                    new TableCell({ children: [new Paragraph(formData.a.toString())] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("b")] }),
                                    new TableCell({ children: [new Paragraph(formData.b.toString())] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("c")] }),
                                    new TableCell({ children: [new Paragraph(formData.c.toString())] })
                                ]
                            })
                        ]
                    }),

                    // Características da bacia
                    new Paragraph({
                        text: "1.2. Características da Bacia",
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 300, after: 100 }
                    }),

                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ text: "Parâmetro", bold: true })],
                                        width: { size: 50, type: WidthType.PERCENTAGE }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: "Valor", bold: true })],
                                        width: { size: 50, type: WidthType.PERCENTAGE }
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Área da Bacia (Ab)")] }),
                                    new TableCell({ children: [new Paragraph(`${formData.ab} km²`)] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Comprimento Horizontal (Ch)")] }),
                                    new TableCell({ children: [new Paragraph(`${formData.ch} km`)] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Diferença de Altura (Alt)")] }),
                                    new TableCell({ children: [new Paragraph(`${formData.alt} m`)] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Coeficiente de Escoamento (Ce)")] }),
                                    new TableCell({ children: [new Paragraph(formData.ce.toString())] })
                                ]
                            })
                        ]
                    }),

                    // Coordenadas
                    new Paragraph({
                        text: "1.3. Coordenadas",
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 300, after: 100 }
                    }),

                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ text: "Local", bold: true })],
                                        width: { size: 40, type: WidthType.PERCENTAGE }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: "Coordenadas", bold: true })],
                                        width: { size: 60, type: WidthType.PERCENTAGE }
                                    })
                                ]
                            }),
                            ...(formData.coord_barramento ? [new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Barramento")] }),
                                    new TableCell({ children: [new Paragraph(formData.coord_barramento)] })
                                ]
                            })] : []),
                            ...(formData.coord_emprestimo ? [new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Área de Empréstimo")] }),
                                    new TableCell({ children: [new Paragraph(formData.coord_emprestimo)] })
                                ]
                            })] : []),
                            ...(formData.coord_bota_fora ? [new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Bota Fora")] }),
                                    new TableCell({ children: [new Paragraph(formData.coord_bota_fora)] })
                                ]
                            })] : [])
                        ]
                    }),

                    // Seção 2: Memorial de Cálculo
                    new Paragraph({
                        text: "2. MEMORIAL DE CÁLCULO",
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 400, after: 200 }
                    }),

                    // Tempo de Concentração
                    new Paragraph({
                        text: "2.1. Tempo de Concentração (Tc)",
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 200, after: 100 }
                    }),

                    new Paragraph({
                        text: "Fórmula utilizada:",
                        spacing: { after: 100 }
                    }),

                    new Paragraph({
                        text: "Tc = ((4 × √Ab) + (1,5 × Ch)) / (0,8 × √Alt) × 60",
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 100 }
                    }),

                    new Paragraph({
                        text: "Substituindo os valores:",
                        spacing: { after: 100 }
                    }),

                    new Paragraph({
                        text: `Tc = ((4 × √${formData.ab}) + (1,5 × ${formData.ch})) / (0,8 × √${formData.alt}) × 60`,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 100 }
                    }),

                    new Paragraph({
                        text: `Tc = ${results.tc.toFixed(2)} minutos`,
                        alignment: AlignmentType.CENTER,
                        bold: true,
                        spacing: { after: 200 }
                    }),

                    // Intensidade Média
                    new Paragraph({
                        text: "2.2. Intensidade Média (Im)",
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 200, after: 100 }
                    }),

                    new Paragraph({
                        text: "Fórmula utilizada:",
                        spacing: { after: 100 }
                    }),

                    new Paragraph({
                        text: "Im = (K × TR^a) / ((b + Tc)^c)",
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 100 }
                    }),

                    new Paragraph({
                        text: "Considerando TR = 30 anos:",
                        spacing: { after: 100 }
                    }),

                    new Paragraph({
                        text: `Im = (${formData.k} × 30^${formData.a}) / ((${formData.b} + ${results.tc.toFixed(2)})^${formData.c})`,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 100 }
                    }),

                    new Paragraph({
                        text: `Im = ${results.im.toFixed(2)} mm/h`,
                        alignment: AlignmentType.CENTER,
                        bold: true,
                        spacing: { after: 200 }
                    }),

                    // Vazão
                    new Paragraph({
                        text: "2.3. Vazão (Q)",
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 200, after: 100 }
                    }),

                    new Paragraph({
                        text: "Fórmula utilizada:",
                        spacing: { after: 100 }
                    }),

                    new Paragraph({
                        text: "Q = (Ce × Im × Ab) / 3,6",
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 100 }
                    }),

                    new Paragraph({
                        text: "Substituindo os valores:",
                        spacing: { after: 100 }
                    }),

                    new Paragraph({
                        text: `Q = (${formData.ce} × ${results.im.toFixed(2)} × ${formData.ab}) / 3,6`,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 100 }
                    }),

                    new Paragraph({
                        text: `Q = ${results.q.toFixed(2)} m³/s`,
                        alignment: AlignmentType.CENTER,
                        bold: true,
                        spacing: { after: 400 }
                    }),

                    // Seção 3: Resumo dos Resultados
                    new Paragraph({
                        text: "3. RESUMO DOS RESULTADOS",
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 400, after: 200 }
                    }),

                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ text: "Parâmetro", bold: true })],
                                        width: { size: 50, type: WidthType.PERCENTAGE }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: "Valor", bold: true })],
                                        width: { size: 50, type: WidthType.PERCENTAGE }
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Tempo de Concentração (Tc)")] }),
                                    new TableCell({ children: [new Paragraph(`${results.tc.toFixed(2)} minutos`)] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Intensidade Média (Im)")] }),
                                    new TableCell({ children: [new Paragraph(`${results.im.toFixed(2)} mm/h`)] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Vazão (Q)")] }),
                                    new TableCell({ children: [new Paragraph(`${results.q.toFixed(2)} m³/s`)] })
                                ]
                            })
                        ]
                    }),

                    // Tamanho dos dispositivos de vazão
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "SERÁ NECESSÁRIO A IMPLANTAÇÃO DE UM MONGE DE ALVENARIA COM MANILHAS DE XXXmm E DE VERTEDOURO COM MANILHAS DE XXXmm.",
                                bold: true
                            })
                        ],
                        spacing: { before: 400, after: 400 }
                    }),

                    new Paragraph({
                        text: "_________________________________",
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 400, after: 100 }
                    }),
                    new Paragraph({
                        text: "Responsável Técnico",
                        alignment: AlignmentType.CENTER
                    })
                ]
            }]
        });

        const buffer = await Packer.toBuffer(doc);

        // Definir headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=memorial_calculo.docx');

        // Enviar arquivo
        res.send(buffer);

    } catch (error) {
        console.error('Erro ao gerar memorial:', error);
        res.status(500).json({ error: 'Erro ao gerar memorial: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse http://localhost:${PORT}`);
});