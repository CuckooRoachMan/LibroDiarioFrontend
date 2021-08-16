import { Component, OnInit } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-libro-diario',
  templateUrl: './libro-diario.component.html',
  styleUrls: ['./libro-diario.component.css']
})
export class LibroDiarioComponent implements OnInit {

  nuevaLinea={
    numero:0,
    cuenta: '',
    subcuenta: '',
    debe:0,
    haber:0
  };

  nuevoPda={
    fecha_creacion: null,
    numeroPda: 0,
    nombreRegistro:'',
    listaLineas:[] as any,
    totalDebe: 0,
    totalHaber: 0
  };
  listaPda=[] as any;

  registrosT=[] as any;
  tablasT=[] as any;               //arreglo solo el nombre de las cuentas, para saber las cuentas de la partida actual
  balanzaComprobacion=[] as any;   //arreglo guarda el nombre de las cuentas (Misma)
  balanzaComprobacionResultados=[] as any;   //arreglo guarda los totales de las operaciones de tabla t (Misma tabla, se debe borrar)
  tablasMayorizacion=[] as any;     //arreglo donde guardan los objetos de la mayorizacion
  contadorPda=1;


  balanzaTotalDebe=0;    //Variables guardan los resultados de la balanza de comprobacion, para confirmar que son iguales
  balanzaTotalHaber=0;




  hasManyEntries=false;  //variable de control si hay entradas en haber y en una sola linea
  pdaNoCuadra=false;    //variable de control si el debe y haber del pda no cuedra
  faltanCamposPda=false;

  //nuevoPda.listaLineas= [] as  any;

  cuentas=[
    'Bancos',
    'Caja Chica',
    'Caja General',
    'Cuentas por Cobrar',
    'Funcionarios y empleados',
    'Anticipo a empleados',
    'Desudores Varios',
    'Rentas por cobrar',
    'Documentos por cobrar',
    'Inventario',
    'Documentos por cobrar',
    'Impuestos Pagados por Anticipado',
    'Publicidad pagada por anticipado',
    'Alquileres pagados por anticipados',
    'Seguros Pagados por Anticipados',
    'Materiales de aseo',
    'Papeleria y utiles',
    'Terrenos',
    'Edificios',
    'Mobilaria y equipos',
    'Equipo de transporte',
    'Maquinaria y Equipo',
    'Equipo de Computo',
    'proveedores',
    'Acreedores Varios',
    'Intereses por Pagar',
    'Impuestos por pagar',
    'Rentas cobradas por anticipado',
    'Documentos por Pagar',
    'Anticipo a Clientes',
    'Comisiones por pagar',
    'Sueldos Y salarios por pagar',
    'Prestamos Bancarios',
    'Hipotecas por Pagar',
    'Beneficios a Empleados',
    'Capital Social',
    'Reserva Legal',
    'ventas',
    'Otros Ingresos',
    'Devoluciones sobre ventas',
    'Descuentos y rebajas sobre ventas',
    'Compras',
    'Gastos sobre compras',
    'Devoluciones sobre Compras',
    'Descuentos y rebajas sobre compras',
    'Gastos de administracion',
    'Gastos de Ventas',
    'Gastos Financieros',
    'Otros Gastos'
  ];


  constructor() { }

  ngOnInit(): void {
  }

  agregarLinea(){

    if ((this.nuevaLinea.debe+this.nuevaLinea.haber==this.nuevaLinea.debe)||(this.nuevaLinea.debe+this.nuevaLinea.haber==this.nuevaLinea.haber) ){     //si se cumple que suma mas que una de los valores, significa que no es igual y no pasa
      this.hasManyEntries=false;
      this.nuevoPda.listaLineas.push(this.nuevaLinea);
      this.nuevoPda.totalDebe=this.nuevoPda.totalDebe+this.nuevaLinea.debe;
      this.nuevoPda.totalHaber=this.nuevoPda.totalHaber+this.nuevaLinea.haber;
      this.nuevaLinea={
        numero:0,
        cuenta: '',
        subcuenta: '',
        debe:0,
        haber:0,
      };
    }
    else {
      this.hasManyEntries=true;
      this.nuevaLinea.debe=0;
      this.nuevaLinea.haber=0;
      console.log("Too many entries");
      console.log(this.nuevaLinea)
    }

    //console.log(this.nuevoPda)
  }
  agregarPda(){
    if ((this.nuevoPda.nombreRegistro=='')||(this.nuevoPda.fecha_creacion==null)||(this.nuevoPda.totalDebe==0)||(this.nuevoPda.totalHaber==0)){
      this.faltanCamposPda=true;
      console.log("Faltan Campos");
    }
    else if(this.nuevoPda.totalDebe==this.nuevoPda.totalHaber){
      this.nuevoPda.numeroPda=this.contadorPda;
      this.contadorPda+=1;
      this.faltanCamposPda=false;
      this.pdaNoCuadra=false;
      this.listaPda.push(this.nuevoPda)

      this.nuevoPda.listaLineas.forEach((element:any) => {
          this.registrosT.push({
            cuenta: element.cuenta,
            debe: element.debe,
            haber: element.haber
          });

          if (!(this.tablasT.includes(element.cuenta))){
            this.tablasT.push(
              element.cuenta
            );
          }
      });

      this.nuevoPda={
        fecha_creacion: null,
        numeroPda: 0,
        nombreRegistro:'',
        listaLineas:[] as any,
        totalDebe: 0,
        totalHaber: 0
      };
      this.crearBalanza();

    }
    else{
      this.pdaNoCuadra=true;
      console.log("No cuadra")
    }
    //console.log("Lista de Pdas")
   //console.log(this.listaPda);
    //console.log("registrosT")
    //console.log(this.registrosT);
    //console.log("TablasT")
    //console.log(this.tablasT);


    //console.log("Balanza");
    //console.log(this.balanzaComprobacion)
    //console.log("Tablas de Mayorizacion");
    //console.log(this.tablasMayorizacion)
    //console.log("Resultados de Balanza");
    //console.log(this.balanzaComprobacionResultados)
  }

  crearBalanza(){
    //Elimino los valores de las siguientes variables para evitar errores
    this.balanzaComprobacion=[] as any;
    this.balanzaComprobacionResultados=[] as any;
    this.tablasMayorizacion=[] as any;

    this.balanzaTotalDebe=0;
    this.balanzaTotalHaber=0;

    //Sumar los debes y haberes para los resultados
    var i;
    for (let i = 0; i < this.tablasT.length; i++) {
      this.balanzaComprobacion.push(
        {
          cuenta:this.tablasT[i],
          debe:[0] ,
          haber:[0]
        }
      )
      this.tablasMayorizacion.push(
        {
          cuenta:this.tablasT[i],
          debe:[] ,
          haber:[]
        }
      )
    }

    this.tablasMayorizacion.forEach((a:any) => {
      this.registrosT.forEach((b:any) => {
        if (a.cuenta===b.cuenta) {
          if (b.debe>0) {
            a.debe.push(b.debe);
          }
          if (b.haber>0) {
              a.haber.push(b.haber);
          }

        }
      });
    });


    this.balanzaComprobacion.forEach((a:any) => {
      this.registrosT.forEach((b:any) => {
        if (a.cuenta===b.cuenta) {
          a.debe[0]+=b.debe;
          a.haber[0]+=b.haber;
        }
      });
    });

    //Calcular los resultados
    this.balanzaComprobacionResultados=this.balanzaComprobacion;
    this.balanzaComprobacionResultados.forEach((element:any) => {
      if(element.debe[0]>element.haber[0]){
        element.debe[0]=element.debe[0]-element.haber[0];
        element.haber[0]=0;
      }
      else if (element.debe[0]<element.haber[0]) {
        element.haber[0]=element.haber[0]-element.debe[0];
        element.debe[0]=0;
      }
      else{
        element.haber[0]=0;
        element.debe[0]=0;
      }

    });
    this.balanzaComprobacionResultados.forEach((element:any) => {
      this.balanzaTotalDebe+=element.debe[0];
      this.balanzaTotalHaber+=element.haber[0];
    });

  }

  cancelarPda(){
    this.nuevoPda=[] as any;
  }

}
