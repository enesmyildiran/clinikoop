"use strict";(()=>{var e={};e.id=6428,e.ids=[6428],e.modules={53524:e=>{e.exports=require("@prisma/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},28644:(e,a,t)=>{t.r(a),t.d(a,{originalPathname:()=>f,patchFetch:()=>g,requestAsyncStorage:()=>p,routeModule:()=>m,serverHooks:()=>h,staticGenerationAsyncStorage:()=>y});var i={};t.r(i),t.d(i,{GET:()=>c,POST:()=>u});var r=t(49303),n=t(88716),s=t(60670),o=t(87070);let l=new(t(53524)).PrismaClient;async function d(e){try{for(let a of[{name:"draft",displayName:"Taslak",color:"#6B7280",order:0,isDefault:!0},{name:"sent",displayName:"G\xf6nderildi",color:"#3B82F6",order:1},{name:"viewed",displayName:"G\xf6r\xfcnt\xfclendi",color:"#10B981",order:2},{name:"accepted",displayName:"Kabul Edildi",color:"#059669",order:3},{name:"rejected",displayName:"Reddedildi",color:"#DC2626",order:4},{name:"expired",displayName:"S\xfcresi Doldu",color:"#F59E0B",order:5}])await l.offerStatus.create({data:{...a,clinicId:e}});let a={name:"Varsayılan Şablon",description:"Yeni klinik i\xe7in varsayılan PDF şablonu",content:JSON.stringify({html:`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Teklif</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { text-align: center; margin-bottom: 30px; }
              .patient-info { margin-bottom: 20px; }
              .treatments { margin-bottom: 20px; }
              .total { font-weight: bold; font-size: 18px; text-align: right; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>{{clinicName}}</h1>
              <p>Teklif</p>
            </div>
            
            <div class="patient-info">
              <h3>Hasta Bilgileri</h3>
              <p><strong>Ad:</strong> {{patientName}}</p>
              <p><strong>Telefon:</strong> {{patientPhone}}</p>
              <p><strong>Tarih:</strong> {{offerDate}}</p>
            </div>
            
            <div class="treatments">
              <h3>Tedavi Planı</h3>
              <table>
                <thead>
                  <tr>
                    <th>Tedavi</th>
                    <th>A\xe7ıklama</th>
                    <th>Fiyat</th>
                  </tr>
                </thead>
                <tbody>
                  {{#each treatments}}
                  <tr>
                    <td>{{name}}</td>
                    <td>{{description}}</td>
                    <td>{{price}} {{../currency}}</td>
                  </tr>
                  {{/each}}
                </tbody>
              </table>
            </div>
            
            <div class="total">
              <p>Toplam: {{totalPrice}} {{currency}}</p>
            </div>
          </body>
          </html>
        `,css:`
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .patient-info { margin-bottom: 20px; }
          .treatments { margin-bottom: 20px; }
          .total { font-weight: bold; font-size: 18px; text-align: right; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        `}),isDefault:!0};for(let e of(await l.pdfTemplate.create({data:a}),[{name:"Google",displayName:"Google",description:"Google arama sonu\xe7ları"},{name:"Sosyal Medya",displayName:"Sosyal Medya",description:"Instagram, Facebook, Twitter"},{name:"Arkadaş Tavsiyesi",displayName:"Arkadaş Tavsiyesi",description:"Mevcut hasta tavsiyesi"},{name:"Yol Levhası",displayName:"Yol Levhası",description:"Yol kenarı levhalar"},{name:"Diğer",displayName:"Diğer",description:"Diğer kaynaklar"}]))await l.referralSource.create({data:e});for(let a of[{key:"default_currency",value:"TRY"},{key:"default_language",value:"tr"},{key:"offer_validity_days",value:"30"},{key:"reminder_days_before",value:"3"},{key:"clinic_logo_url",value:""},{key:"clinic_address",value:""},{key:"clinic_phone",value:""},{key:"clinic_email",value:""}])await l.clinicSetting.create({data:{...a,clinicId:e}});console.log(`Klinik ${e} i\xe7in varsayılan veriler oluşturuldu`)}catch(a){throw console.error(`Klinik ${e} i\xe7in varsayılan veriler oluşturulurken hata:`,a),a}}async function c(){try{let e=await l.clinic.findMany({include:{users:{select:{id:!0,name:!0,email:!0,role:!0,isActive:!0}},package:{select:{id:!0,name:!0,price:!0,currency:!0}},_count:{select:{patients:!0,offers:!0}}},orderBy:{createdAt:"desc"}});return o.NextResponse.json(e)}catch(e){return console.error("Klinikler listelenirken hata:",e),o.NextResponse.json({error:"Klinikler listelenirken bir hata oluştu"},{status:500})}}async function u(e){try{let{name:a,subdomain:t,domain:i,maxUsers:r,maxPatients:n,maxOffers:s,isActive:c}=await e.json();if(!a||!t)return o.NextResponse.json({message:"Klinik adı ve subdomain zorunludur"},{status:400});if(!/^[a-z0-9-]+$/.test(t))return o.NextResponse.json({message:"Subdomain sadece k\xfc\xe7\xfck harf, rakam ve tire i\xe7erebilir"},{status:400});if(t.length<3||t.length>50)return o.NextResponse.json({message:"Subdomain 3-50 karakter arasında olmalıdır"},{status:400});if(await l.clinic.findUnique({where:{subdomain:t}}))return o.NextResponse.json({message:"Bu subdomain zaten kullanılıyor"},{status:400});if(i&&!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(i))return o.NextResponse.json({message:"Ge\xe7ersiz domain formatı"},{status:400});if(r<1||r>100)return o.NextResponse.json({message:"Maksimum kullanıcı sayısı 1-100 arasında olmalıdır"},{status:400});if(n<1||n>1e4)return o.NextResponse.json({message:"Maksimum hasta sayısı 1-10000 arasında olmalıdır"},{status:400});if(s<1||s>1e4)return o.NextResponse.json({message:"Maksimum teklif sayısı 1-10000 arasında olmalıdır"},{status:400});let u=await l.clinic.create({data:{name:a,subdomain:t,domain:i||null,maxUsers:r,maxPatients:n,maxOffers:s,isActive:void 0===c||c}});return await d(u.id),o.NextResponse.json(u,{status:201})}catch(e){return console.error("Klinik oluşturulurken hata:",e),o.NextResponse.json({message:"Klinik oluşturulurken bir hata oluştu"},{status:500})}}let m=new r.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/admin/clinics/route",pathname:"/api/admin/clinics",filename:"route",bundlePath:"app/api/admin/clinics/route"},resolvedPagePath:"/Users/emyildiran/Desktop/Clinikoop-1/src/app/api/admin/clinics/route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:p,staticGenerationAsyncStorage:y,serverHooks:h}=m,f="/api/admin/clinics/route";function g(){return(0,s.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:y})}}};var a=require("../../../../webpack-runtime.js");a.C(e);var t=e=>a(a.s=e),i=a.X(0,[9276,5972],()=>t(28644));module.exports=i})();