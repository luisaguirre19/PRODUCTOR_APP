import { Component } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { SqlService } from 'src/app/servicios/sql.service';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { finalize, map } from 'rxjs/operators';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
@Component({
  selector: 'app-productores',
  templateUrl: './productores.component.html',
  styleUrls: ['./productores.component.css']
})
export class ProductoresComponent {
  name: string;
  age: number;
  peso:number
  parcialidad:number
  etiqueta

  tableData
  displayedColumns: string[] = ['id_estado_cuenta', 'id_cuenta', 'peso_esperado', 'peso_total', 'diferencia', 'estado', 'fecha', 'imprimir'];
  						
  constructor(
    private sqlService:SqlService,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.traer_datos()
  }


  traer_datos(){
    this.sqlService.postData("estado_cuenta",{
      "correo":this.authService.correo_usuario
   })
   .subscribe(data=>{
      this.tableData = data
   })

 }

 print(id_cuenta,peso_esperado,peso_total,diferencia, estado, fecha) {

  var docDefinition = {
   // watermark: { text: 'PESO CABAL, S.A.', color: 'blue', opacity: 0.3, bold: true, italics: false },
    content: [
      { text: 'Beneficio cafetito S.A.', style: 'subheader' },
      'A continuación te adjuntamos los datos de cuenta:',
      {
        style: 'tableExample',
        color: '#444',
        table: {
          widths: [200, 'auto', 'auto'],
          headerRows: 2,
          // keepWithHeaderRows: 1,
          body: [
            [{ text: 'Identificador de la cuenta', style: 'tableHeader', colSpan: 2, alignment: 'Left' }, {}, { text: id_cuenta.toString(), style: 'tableHeader', alignment: 'Right' }],
            [{ text: 'Peso esperado:', style: 'tableHeader', colSpan: 2, alignment: 'Left' }, {}, { text: peso_esperado.toString(), style: 'tableHeader', alignment: 'Right' }],
            [{ text: 'Peso total', style: 'tableHeader', colSpan: 2, alignment: 'Left' }, {}, { text: peso_total.toString(), style: 'tableHeader', alignment: 'Right' }],
            [{ text: 'Diferencia', style: 'tableHeader', colSpan: 2, alignment: 'Left' }, {}, { text: diferencia.toString(), style: 'tableHeader', alignment: 'Right' }],
            [{ text: 'Estado', style: 'tableHeader', colSpan: 2, alignment: 'Left' }, {}, { text: estado.toString(), style: 'tableHeader', alignment: 'Right' }],
            [{ text: 'Fecha', style: 'tableHeader', colSpan: 2, alignment: 'Left' }, {}, { text: fecha.toString(), style: 'tableHeader', alignment: 'Right' }]
          ]
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      tableOpacityExample: {
        margin: [0, 5, 0, 15],
        fillColor: 'blue',
        fillOpacity: 0.3
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      }
    },
    defaultStyle: {
      // alignment: 'justify'
    },
    patterns: {
      stripe45d: {
        boundingBox: [1, 1, 4, 4],
        xStep: 3,
        yStep: 3,
        pattern: '1 w 0 1 m 4 5 l s 2 0 m 5 3 l s'
      }
    }
  };
  
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.download('documento.pdf');  // Nombre del archivo de salida
}
}