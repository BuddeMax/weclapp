(function(){"use strict";var A={7652:function(A,e,t){var a=t(9242),n=t(3396);function r(A,e,t,a,r,o){const l=(0,n.up)("app-navbar"),s=(0,n.up)("router-view");return(0,n.wg)(),(0,n.iD)(n.HY,null,[(0,n.Wm)(l),(0,n.Wm)(s)],64)}const o=A=>((0,n.dD)("data-v-18795c18"),A=A(),(0,n.Cn)(),A),l={class:"navbar"},s={class:"container-fluid"},i=o((()=>(0,n._)("a",{class:"navbar-brand",href:"#"},"CheckIn App",-1))),c=o((()=>(0,n._)("button",{class:"navbar-toggler",type:"button","data-bs-toggle":"collapse","data-bs-target":"#navbarNavAltMarkup","aria-controls":"navbarNavAltMarkup","aria-expanded":"false","aria-label":"Toggle navigation"},[(0,n._)("span",{class:"navbar-toggler-icon"})],-1))),u={class:"collapse navbar-collapse",id:"navbarNavAltMarkup"},d={class:"navbar-nav mr-auto"};function h(A,e,t,a,r,o){const h=(0,n.up)("router-link");return(0,n.wg)(),(0,n.iD)("nav",l,[(0,n._)("div",s,[i,c,(0,n._)("div",u,[(0,n._)("div",d,[(0,n.Wm)(h,{class:"nav-link",to:"/"},{default:(0,n.w5)((()=>[(0,n.Uk)("Home")])),_:1}),(0,n.Wm)(h,{class:"nav-link",to:"/about"},{default:(0,n.w5)((()=>[(0,n.Uk)("CheckIn")])),_:1})])])])])}var p={name:"AppNavbar"},k=t(89);const w=(0,k.Z)(p,[["render",h],["__scopeId","data-v-18795c18"]]);var m=w,g={name:"App",components:{AppNavbar:m}};const f=(0,k.Z)(g,[["render",r]]);var C=f,b=t(65),v=t(1076);const y=(0,b.MT)({state:{isAuthenticated:!1,userEmail:null,token:null,userId:null,startDate:"",endDate:"",weeklyCheckIn:!1,checkInInput:!1},mutations:{setAuthentication(A,e){A.isAuthenticated=e},setEmail(A,e){A.userEmail=e},setToken(A,e){A.token=e},setUserId(A,e){A.userId=e},setStartDate(A,e){A.startDate=e},setEndDate(A,e){A.endDate=e},setWeeklyCheckIn(A,e){A.weeklyCheckIn=e},setCheckInInput(A,e){A.checkInInput=e}},actions:{authenticate({commit:A},e){return v.Z.post("/api/authenticate",e).then((t=>200===t.status?(A("setAuthentication",!0),A("setToken",t.data.access_token),A("setEmail",e.email),A("setUserId",t.data.user_id),!0):(A("setAuthentication",!1),A("setToken",null),!1))).catch((()=>(A("setAuthentication",!1),A("setToken",null),!1)))}}});var D=t(2483);function I(A,e,t,a,n,r){return null}var J=t(7139);const B={class:"hello"},T=(0,n.uE)('<p data-v-b9167eee> For a guide and recipes on how to configure / customize this project,<br data-v-b9167eee> check out the <a href="https://cli.vuejs.org" target="_blank" rel="noopener" data-v-b9167eee>vue-cli documentation</a>. </p><h3 data-v-b9167eee>Installed CLI Plugins</h3><ul data-v-b9167eee><li data-v-b9167eee><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener" data-v-b9167eee>babel</a></li><li data-v-b9167eee><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener" data-v-b9167eee>eslint</a></li></ul><h3 data-v-b9167eee>Essential Links</h3><ul data-v-b9167eee><li data-v-b9167eee><a href="https://vuejs.org" target="_blank" rel="noopener" data-v-b9167eee>Core Docs</a></li><li data-v-b9167eee><a href="https://forum.vuejs.org" target="_blank" rel="noopener" data-v-b9167eee>Forum</a></li><li data-v-b9167eee><a href="https://chat.vuejs.org" target="_blank" rel="noopener" data-v-b9167eee>Community Chat</a></li><li data-v-b9167eee><a href="https://twitter.com/vuejs" target="_blank" rel="noopener" data-v-b9167eee>Twitter</a></li><li data-v-b9167eee><a href="https://news.vuejs.org" target="_blank" rel="noopener" data-v-b9167eee>News</a></li></ul><h3 data-v-b9167eee>Ecosystem</h3><ul data-v-b9167eee><li data-v-b9167eee><a href="https://router.vuejs.org" target="_blank" rel="noopener" data-v-b9167eee>vue-router</a></li><li data-v-b9167eee><a href="https://vuex.vuejs.org" target="_blank" rel="noopener" data-v-b9167eee>vuex</a></li><li data-v-b9167eee><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener" data-v-b9167eee>vue-devtools</a></li><li data-v-b9167eee><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener" data-v-b9167eee>vue-loader</a></li><li data-v-b9167eee><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener" data-v-b9167eee>awesome-vue</a></li></ul>',7);function S(A,e,t,a,r,o){return(0,n.wg)(),(0,n.iD)("div",B,[(0,n._)("h1",null,(0,J.zw)(t.msg),1),T])}var Q={name:"HelloWorld",props:{msg:String}};const P=(0,k.Z)(Q,[["render",S],["__scopeId","data-v-b9167eee"]]);var E=P,z={name:"Home",components:{HelloWorld:E}};const _=(0,k.Z)(z,[["render",I]]);var O=_;const U=A=>((0,n.dD)("data-v-49f19954"),A=A(),(0,n.Cn)(),A),N=U((()=>(0,n._)("h1",{class:"text-center"},"Check-In List",-1)));function H(A,e,t,a,r,o){const l=(0,n.up)("CheckInInput"),s=(0,n.up)("CheckInForm"),i=(0,n.up)("CheckInCard"),c=(0,n.up)("WeeklyCheckInCard");return(0,n.wg)(),(0,n.iD)(n.HY,null,[(0,n.Wm)(l,{ref:"checkInInputRef"},null,512),r.isFormOpen?((0,n.wg)(),(0,n.j4)(s,{key:0,onCheckInAdded:o.fetchData},null,8,["onCheckInAdded"])):(0,n.kq)("",!0),N,((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(r.mergedCheckIns,((e,t)=>((0,n.wg)(),(0,n.iD)("div",{key:t},["daily"===e.type?((0,n.wg)(),(0,n.j4)(i,{key:0,checkIn:e.data,showHeader:0===t},null,8,["checkIn","showHeader"])):"weekly"===e.type&&A.$store.state.weeklyCheckIn?((0,n.wg)(),(0,n.j4)(c,{key:1,weeklyCheckIn:e.data,showHeader:0===t},null,8,["weeklyCheckIn","showHeader"])):(0,n.kq)("",!0)])))),128))],64)}t(560);const j=A=>((0,n.dD)("data-v-161e62b3"),A=A(),(0,n.Cn)(),A),M={class:"checkIn-card"},q={key:0},W=j((()=>(0,n._)("tr",null,[(0,n._)("th",null,"Date"),(0,n._)("th",null,"Fatigue"),(0,n._)("th",null,"Mood"),(0,n._)("th",null,"Pain"),(0,n._)("th",null,"Weight"),(0,n._)("th",null,"Sleep"),(0,n._)("th",null,"Heart Rate"),(0,n._)("th",null,"Calories"),(0,n._)("th",null,"Protein"),(0,n._)("th",null,"Carbs"),(0,n._)("th",null,"Fat"),(0,n._)("th",null,"Water"),(0,n._)("th",null,"Steps"),(0,n._)("th",null,"URL")],-1))),L=[W],F=["href"];function K(A,e,t,a,r,o){return(0,n.wg)(),(0,n.iD)("div",M,[t.showHeader?((0,n.wg)(),(0,n.iD)("table",q,L)):(0,n.kq)("",!0),(0,n._)("table",null,[(0,n._)("tr",null,[(0,n._)("td",null,(0,J.zw)(t.checkIn.date),1),(0,n._)("td",null,(0,J.zw)(t.checkIn.fatigue),1),(0,n._)("td",null,(0,J.zw)(t.checkIn.mood),1),(0,n._)("td",null,(0,J.zw)(t.checkIn.pain),1),(0,n._)("td",null,(0,J.zw)(t.checkIn.weight),1),(0,n._)("td",null,(0,J.zw)(t.checkIn.sleep),1),(0,n._)("td",null,(0,J.zw)(t.checkIn.heartRate),1),(0,n._)("td",null,(0,J.zw)(t.checkIn.calories),1),(0,n._)("td",null,(0,J.zw)(t.checkIn.protein),1),(0,n._)("td",null,(0,J.zw)(t.checkIn.carb),1),(0,n._)("td",null,(0,J.zw)(t.checkIn.fat),1),(0,n._)("td",null,(0,J.zw)(t.checkIn.water),1),(0,n._)("td",null,(0,J.zw)(t.checkIn.steps),1),(0,n._)("td",null,[(0,n._)("a",{href:t.checkIn.url,target:"_blank"},"Link",8,F)])])])])}var G={props:{checkIn:{type:Object,required:!0},showHeader:{type:Boolean,default:!0}}};const Y=(0,k.Z)(G,[["render",K],["__scopeId","data-v-161e62b3"]]);var R=Y,X=t(4870);const Z=A=>((0,n.dD)("data-v-44526b2a"),A=A(),(0,n.Cn)(),A),V=Z((()=>(0,n._)("h2",null,"Check-In Input",-1))),x={class:"dates-container"},$={class:"date-input"},AA=Z((()=>(0,n._)("label",{for:"startDate"},"Startdatum:",-1))),eA={class:"date-input"},tA=Z((()=>(0,n._)("label",{for:"endDate"},"Enddatum:",-1))),aA={class:"checkbox-input"},nA=Z((()=>(0,n._)("label",{for:"weeklyCheckIn"},"Wöchentlichen Check-In anzeigen:",-1))),rA=Z((()=>(0,n._)("button",{type:"submit",class:"submit-btn"},"Submit",-1)));var oA={__name:"CheckInInput",setup(A){const e=(0,b.oR)(),t=(0,X.iH)(e.state.startDate),r=(0,X.iH)(e.state.endDate),o=(0,X.iH)(e.state.weeklyCheckIn);(0,n.YP)(t,(A=>{e.commit("setStartDate",A)})),(0,n.YP)(r,(A=>{e.commit("setEndDate",A)})),(0,n.YP)(o,(A=>{e.commit("setWeeklyCheckIn",A)}));const l=()=>{e.state.checkInInput=!0};return(A,e)=>((0,n.wg)(),(0,n.iD)("form",{class:"input-container",onSubmit:(0,a.iM)(l,["prevent"])},[V,(0,n._)("div",x,[(0,n._)("div",$,[AA,(0,n.wy)((0,n._)("input",{type:"date",id:"startDate","onUpdate:modelValue":e[0]||(e[0]=A=>t.value=A),required:""},null,512),[[a.nr,t.value]])]),(0,n._)("div",eA,[tA,(0,n.wy)((0,n._)("input",{type:"date",id:"endDate","onUpdate:modelValue":e[1]||(e[1]=A=>r.value=A),required:""},null,512),[[a.nr,r.value]])]),(0,n._)("div",aA,[nA,(0,n.wy)((0,n._)("input",{type:"checkbox",id:"weeklyCheckIn","onUpdate:modelValue":e[2]||(e[2]=A=>o.value=A)},null,512),[[a.e8,o.value]])]),rA])],32))}};const lA=(0,k.Z)(oA,[["__scopeId","data-v-44526b2a"]]);var sA=lA;const iA=A=>((0,n.dD)("data-v-ecfc7b18"),A=A(),(0,n.Cn)(),A),cA={class:"weekly-checkIn-card"},uA=iA((()=>(0,n._)("td",null,null,-1)));function dA(A,e,t,a,r,o){return(0,n.wg)(),(0,n.iD)("div",cA,[(0,n._)("table",null,[(0,n._)("tr",null,[(0,n._)("td",null,(0,J.zw)(t.weeklyCheckIn.fromDate)+" to "+(0,J.zw)(t.weeklyCheckIn.toDate),1),(0,n._)("td",null,(0,J.zw)(t.weeklyCheckIn.fatigue),1),(0,n._)("td",null,(0,J.zw)(t.weeklyCheckIn.mood),1),(0,n._)("td",null,(0,J.zw)(t.weeklyCheckIn.pain),1),(0,n._)("td",null,(0,J.zw)(t.weeklyCheckIn.weight),1),(0,n._)("td",null,(0,J.zw)(t.weeklyCheckIn.sleep),1),(0,n._)("td",null,(0,J.zw)(t.weeklyCheckIn.heartRate),1),(0,n._)("td",null,(0,J.zw)(t.weeklyCheckIn.calories),1),(0,n._)("td",null,(0,J.zw)(t.weeklyCheckIn.protein),1),(0,n._)("td",null,(0,J.zw)(t.weeklyCheckIn.carb),1),(0,n._)("td",null,(0,J.zw)(t.weeklyCheckIn.fat),1),(0,n._)("td",null,(0,J.zw)(t.weeklyCheckIn.water),1),(0,n._)("td",null,(0,J.zw)(t.weeklyCheckIn.steps),1),uA])])])}var hA={props:{weeklyCheckIn:{type:Object,required:!0},showHeader:{type:Boolean,default:!0}}};const pA=(0,k.Z)(hA,[["render",dA],["__scopeId","data-v-ecfc7b18"]]);var kA=pA;const wA=A=>((0,n.dD)("data-v-48e7c386"),A=A(),(0,n.Cn)(),A),mA={class:"checkIn-form"},gA=["src"],fA={class:"form-group"},CA=wA((()=>(0,n._)("label",{for:"date"},"Datum:",-1))),bA={class:"form-group"},vA=wA((()=>(0,n._)("label",{for:"fatigue"},"Müdigkeit (1-10):",-1))),yA={class:"form-group"},DA=wA((()=>(0,n._)("label",{for:"mood"},"Stimmung (1-10):",-1))),IA={class:"form-group"},JA=wA((()=>(0,n._)("label",{for:"pain"},"Schmerz (1-10):",-1))),BA={class:"form-group"},TA=wA((()=>(0,n._)("label",{for:"weight"},"Gewicht (kg):",-1))),SA={class:"form-group"},QA=wA((()=>(0,n._)("label",{for:"sleep"},"Schlaf (hh:mm):",-1))),PA={class:"form-group"},EA=wA((()=>(0,n._)("label",{for:"heartRate"},"Herzrate:",-1))),zA={class:"form-group"},_A=wA((()=>(0,n._)("label",{for:"calories"},"Kalorien:",-1))),OA={class:"form-group"},UA=wA((()=>(0,n._)("label",{for:"protein"},"Protein (g):",-1))),NA={class:"form-group"},HA=wA((()=>(0,n._)("label",{for:"carb"},"Kohlenhydrate (g):",-1))),jA={class:"form-group"},MA=wA((()=>(0,n._)("label",{for:"fat"},"Fett (g):",-1))),qA={class:"form-group"},WA=wA((()=>(0,n._)("label",{for:"water"},"Wasser (ml):",-1))),LA={class:"form-group"},FA=wA((()=>(0,n._)("label",{for:"steps"},"Schritte:",-1))),KA={class:"form-group"},GA=wA((()=>(0,n._)("label",{for:"url"},"URL:",-1))),YA=wA((()=>(0,n._)("button",{type:"submit"},"CheckIn hinzufügen",-1)));function RA(A,e,r,o,l,s){return(0,n.wg)(),(0,n.iD)("div",mA,[(0,n._)("button",{class:"toggle-form-button",onClick:e[0]||(e[0]=(...A)=>s.toggleForm&&s.toggleForm(...A))},[(0,n._)("img",{src:l.isFormOpen?t(5440):t(4762),alt:"Toggle Form",class:"toggle-form-image"},null,8,gA)]),l.isFormOpen?((0,n.wg)(),(0,n.iD)("form",{key:0,onSubmit:e[15]||(e[15]=(0,a.iM)(((...A)=>s.submitForm&&s.submitForm(...A)),["prevent"]))},[(0,n._)("div",fA,[CA,(0,n.wy)((0,n._)("input",{type:"date",id:"date","onUpdate:modelValue":e[1]||(e[1]=A=>l.formData.date=A),required:""},null,512),[[a.nr,l.formData.date]])]),(0,n._)("div",bA,[vA,(0,n.wy)((0,n._)("input",{type:"number",id:"fatigue","onUpdate:modelValue":e[2]||(e[2]=A=>l.formData.fatigue=A),min:"1",max:"10",required:""},null,512),[[a.nr,l.formData.fatigue]])]),(0,n._)("div",yA,[DA,(0,n.wy)((0,n._)("input",{type:"number",id:"mood","onUpdate:modelValue":e[3]||(e[3]=A=>l.formData.mood=A),min:"1",max:"10",required:""},null,512),[[a.nr,l.formData.mood]])]),(0,n._)("div",IA,[JA,(0,n.wy)((0,n._)("input",{type:"number",id:"pain","onUpdate:modelValue":e[4]||(e[4]=A=>l.formData.pain=A),min:"1",max:"10",required:""},null,512),[[a.nr,l.formData.pain]])]),(0,n._)("div",BA,[TA,(0,n.wy)((0,n._)("input",{type:"number",id:"weight","onUpdate:modelValue":e[5]||(e[5]=A=>l.formData.weight=A),step:"0.1",required:""},null,512),[[a.nr,l.formData.weight]])]),(0,n._)("div",SA,[QA,(0,n.wy)((0,n._)("input",{type:"time",id:"sleep","onUpdate:modelValue":e[6]||(e[6]=A=>l.formData.sleep=A),required:""},null,512),[[a.nr,l.formData.sleep]])]),(0,n._)("div",PA,[EA,(0,n.wy)((0,n._)("input",{type:"number",id:"heartRate","onUpdate:modelValue":e[7]||(e[7]=A=>l.formData.heartRate=A),required:""},null,512),[[a.nr,l.formData.heartRate]])]),(0,n._)("div",zA,[_A,(0,n.wy)((0,n._)("input",{type:"number",id:"calories","onUpdate:modelValue":e[8]||(e[8]=A=>l.formData.calories=A),required:""},null,512),[[a.nr,l.formData.calories]])]),(0,n._)("div",OA,[UA,(0,n.wy)((0,n._)("input",{type:"number",id:"protein","onUpdate:modelValue":e[9]||(e[9]=A=>l.formData.protein=A),required:""},null,512),[[a.nr,l.formData.protein]])]),(0,n._)("div",NA,[HA,(0,n.wy)((0,n._)("input",{type:"number",id:"carb","onUpdate:modelValue":e[10]||(e[10]=A=>l.formData.carb=A),required:""},null,512),[[a.nr,l.formData.carb]])]),(0,n._)("div",jA,[MA,(0,n.wy)((0,n._)("input",{type:"number",id:"fat","onUpdate:modelValue":e[11]||(e[11]=A=>l.formData.fat=A),required:""},null,512),[[a.nr,l.formData.fat]])]),(0,n._)("div",qA,[WA,(0,n.wy)((0,n._)("input",{type:"number",id:"water","onUpdate:modelValue":e[12]||(e[12]=A=>l.formData.water=A),required:""},null,512),[[a.nr,l.formData.water]])]),(0,n._)("div",LA,[FA,(0,n.wy)((0,n._)("input",{type:"number",id:"steps","onUpdate:modelValue":e[13]||(e[13]=A=>l.formData.steps=A),required:""},null,512),[[a.nr,l.formData.steps]])]),(0,n._)("div",KA,[GA,(0,n.wy)((0,n._)("input",{type:"url",id:"url","onUpdate:modelValue":e[14]||(e[14]=A=>l.formData.url=A)},null,512),[[a.nr,l.formData.url]])]),YA],32)):(0,n.kq)("",!0)])}var XA={data(){return{isFormOpen:!1,formData:{date:"",fatigue:0,mood:0,pain:0,weight:0,sleep:"",heartRate:0,calories:0,protein:0,carb:0,fat:0,water:0,steps:0,url:""}}},methods:{toggleForm(){this.isFormOpen=!this.isFormOpen},submitForm(){const A=new Headers;A.append("Content-Type","application/json");const e=this.$store.state.token.access_token;A.append("Authorization",`Bearer ${e}`);const t=JSON.stringify(this.formData),a={method:"POST",headers:A,body:t,redirect:"follow"};fetch(`http://localhost:8080/api/user/${this.$store.state.userId}/checkIn`,a).then((A=>A.json())).then((A=>{console.log(A),this.$emit("checkInAdded")})).catch((A=>{console.log("error",A)}))}}};const ZA=(0,k.Z)(XA,[["render",RA],["__scopeId","data-v-48e7c386"]]);var VA=ZA,xA={name:"About",components:{WeeklyCheckInCard:kA,CheckInCard:R,CheckInInput:sA,CheckInForm:VA},data(){return{isFormOpen:!0,buttonStatus:!1,inputValue:"",mergedCheckIns:[],checkIns:[],weeklyCheckIns:[],currentWeek:1,pageSize:7,userId:"",userEmail:this.$store.state.userEmail,token:this.$store.state.token.access_token}},created(){(0,n.YP)((()=>y.state.checkInInput),(async A=>{!0===A&&(await this.fetchCheckIns(),await this.fetchWeeklyCheckIns(),this.mergeCheckIns())}),{immediate:!0})},watch:{"$store.state.startDate":function(){this.fetchData()},"$store.state.endDate":function(){this.fetchData()}},methods:{compareDates(A,e){const t=new Date(A.date),a=new Date(e.date);return t<a?-1:t>a?1:0},compareWeeklyDates(A,e){const t=Date.parse(A.toDate),a=Date.parse(e.toDate),n=Date.parse(A.fromDate),r=Date.parse(e.fromDate);return t<a?-1:t>a?1:n<r?-1:n>r?1:0},async fetchData(){try{await this.fetchCheckIns(),await this.fetchWeeklyCheckIns(),this.mergeCheckIns()}catch(A){console.error("Fehler beim Abrufen der Daten:",A)}},async fetchCheckIns(){return new Promise(((A,e)=>{const t=new Headers;t.append("Content-Type","application/json");const a=this.$store.state.token.access_token;t.append("Authorization",`Bearer ${a}`);const n={method:"GET",headers:t,redirect:"follow"};fetch(`http://localhost:8080/api/user/${this.$store.state.userId}/checkIn/${this.$store.state.startDate}/${this.$store.state.endDate}`,n).then((A=>{if(!A.ok)throw new Error("Netzwerkantwort war nicht ok");return A.json()})).then((e=>{this.checkIns=e,this.checkIns.sort(this.compareDates),console.log("Daily CheckIns fetched and sorted:",this.checkIns),A()})).catch((A=>{console.error("Fehler beim Abrufen der Check-Ins:",A),e(A)}))}))},async fetchWeeklyCheckIns(){const A=new Headers;A.append("Content-Type","application/json");const e=this.$store.state.token.access_token;A.append("Authorization",`Bearer ${e}`);const t={method:"GET",headers:A,redirect:"follow"},a=new Date(this.$store.state.startDate);a.setDate(a.getDate()-6);const n=a.toISOString().split("T")[0],r=this.checkIns.length>0?n:this.$store.state.startDate;fetch(`http://localhost:8080/api/user/${this.$store.state.userId}/weeklyCheckIn/${r}/${this.$store.state.endDate}`,t).then((A=>{if(!A.ok)throw new Error("Netzwerkantwort war nicht ok");return A.json()})).then((A=>{this.weeklyCheckIns=A,this.weeklyCheckIns.sort(this.compareWeeklyDates),console.log("Weekly CheckIns fetched and sorted:",this.weeklyCheckIns),this.checkIns.length>0&&this.mergeCheckIns()})).catch((A=>console.error("Fehler beim Abrufen der Check-Ins:",A)))},mergeCheckIns(){const A=[];let e=0;this.checkIns.sort(this.compareDates),this.weeklyCheckIns.sort(this.compareWeeklyDates);for(const t of this.checkIns){while(e<this.weeklyCheckIns.length&&new Date(this.weeklyCheckIns[e].fromDate)<=new Date(t.date)){if(!(new Date(this.weeklyCheckIns[e].toDate)<new Date(t.date)))break;A.push({type:"weekly",data:this.weeklyCheckIns[e]}),e++}A.push({type:"daily",data:t})}while(e<this.weeklyCheckIns.length)A.push({type:"weekly",data:this.weeklyCheckIns[e]}),e++;this.mergedCheckIns=A,console.log("Merged CheckIns:",this.mergedCheckIns)}}};const $A=(0,k.Z)(xA,[["render",H],["__scopeId","data-v-49f19954"]]);var Ae=$A;const ee=A=>((0,n.dD)("data-v-8c24aaec"),A=A(),(0,n.Cn)(),A),te=ee((()=>(0,n._)("h2",null,"Login",-1))),ae=ee((()=>(0,n._)("label",{for:"email"},"Email:",-1))),ne=ee((()=>(0,n._)("label",{for:"password"},"Password:",-1))),re=ee((()=>(0,n._)("button",{type:"submit"},"Login",-1))),oe=ee((()=>(0,n._)("p",null,"Noch kein Account ?",-1)));function le(A,e,t,r,o,l){const s=(0,n.up)("router-link");return(0,n.wg)(),(0,n.iD)("div",null,[(0,n._)("form",{onSubmit:e[2]||(e[2]=(0,a.iM)(((...A)=>l.submitForm&&l.submitForm(...A)),["prevent"]))},[te,(0,n._)("div",null,[ae,(0,n.wy)((0,n._)("input",{type:"email",id:"email","onUpdate:modelValue":e[0]||(e[0]=A=>o.email=A),required:""},null,512),[[a.nr,o.email]])]),(0,n._)("div",null,[ne,(0,n.wy)((0,n._)("input",{type:"password",id:"password","onUpdate:modelValue":e[1]||(e[1]=A=>o.password=A),required:""},null,512),[[a.nr,o.password]])]),re,oe,(0,n.Wm)(s,{class:"nav-link",to:"/register"},{default:(0,n.w5)((()=>[(0,n.Uk)("Register")])),_:1})],32)])}var se={data(){return{email:"",password:""}},methods:{submitForm(){this.sendRequest()},async sendRequest(){const A="http://localhost:8080/api/v1/auth/authenticate",e="http://localhost:8080/api/user/me",t={email:this.email,password:this.password};try{const a=await fetch(A,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok){const A=`Ein Fehler ist aufgetreten: ${a.status}`;throw new Error(A)}const n=await a.json();console.log(`JWT Token: ${n.access_token}`),this.$store.commit("setAuthentication",!0),this.$store.commit("setToken",n),this.$store.commit("setEmail",this.email),await this.fetchUserId(n.access_token,e),this.$router.push({name:"Home"})}catch(a){console.error(a),this.$store.commit("setAuthentication",!1)}},async fetchUserId(A,e){try{const t=await fetch(e,{method:"GET",headers:{Authorization:`Bearer ${A}`}});if(!t.ok)throw new Error(`Fehler beim Abrufen der Benutzer-ID: ${t.statusText}`);const a=await t.json();console.log(`Benutzer ID: ${a}`),this.$store.commit("setUserId",a),console.log(`Benutzer ID: ${this.$store.state.userId}`)}catch(t){console.error(`Fehler beim Fetchen der Benutzer-ID: ${t}`)}}}};const ie=(0,k.Z)(se,[["render",le],["__scopeId","data-v-8c24aaec"]]);var ce=ie,ue={__name:"Login",setup(A){return(A,e)=>((0,n.wg)(),(0,n.j4)(ce))}};const de=ue;var he=de;const pe=A=>((0,n.dD)("data-v-7a512a5c"),A=A(),(0,n.Cn)(),A),ke=pe((()=>(0,n._)("h2",null,"Create Account",-1))),we=pe((()=>(0,n._)("label",{for:"firstname"},"First name",-1))),me=pe((()=>(0,n._)("label",{for:"lastname"},"Last name",-1))),ge=pe((()=>(0,n._)("label",{for:"email"},"Email",-1))),fe=pe((()=>(0,n._)("label",{for:"password"},"Password",-1))),Ce=pe((()=>(0,n._)("button",{type:"submit"},"Create Account",-1))),be=pe((()=>(0,n._)("div",null,"OR",-1))),ve=pe((()=>(0,n._)("button",{type:"button"},"Sign up with Google",-1))),ye=pe((()=>(0,n._)("p",null,"Bereits ein Account ?",-1)));function De(A,e,t,r,o,l){const s=(0,n.up)("router-link");return(0,n.wg)(),(0,n.iD)("div",null,[ke,(0,n._)("form",{onSubmit:e[4]||(e[4]=(0,a.iM)(((...A)=>l.submitForm&&l.submitForm(...A)),["prevent"]))},[(0,n._)("div",null,[we,(0,n.wy)((0,n._)("input",{type:"text",id:"firstname","onUpdate:modelValue":e[0]||(e[0]=A=>o.firstname=A),required:""},null,512),[[a.nr,o.firstname]])]),(0,n._)("div",null,[me,(0,n.wy)((0,n._)("input",{type:"text",id:"lastname","onUpdate:modelValue":e[1]||(e[1]=A=>o.lastname=A),required:""},null,512),[[a.nr,o.lastname]])]),(0,n._)("div",null,[ge,(0,n.wy)((0,n._)("input",{type:"email",id:"email","onUpdate:modelValue":e[2]||(e[2]=A=>o.email=A),required:""},null,512),[[a.nr,o.email]])]),(0,n._)("div",null,[fe,(0,n.wy)((0,n._)("input",{type:"password",id:"password","onUpdate:modelValue":e[3]||(e[3]=A=>o.password=A),required:""},null,512),[[a.nr,o.password]])]),Ce,be,ve,ye,(0,n.Wm)(s,{class:"nav-link",to:"/login"},{default:(0,n.w5)((()=>[(0,n.Uk)("Login")])),_:1})],32)])}var Ie={data(){return{firstname:"",lastname:"",email:"",password:"",token:{access_token:"",refresh_token:""}}},methods:{submitForm(){setTimeout(this.sendRequest,1e3)},async sendRequest(){const A="http://localhost:8080/api/v1/auth/register",e={firstname:this.firstname,lastname:this.lastname,email:this.email,password:this.password},t=await fetch(A,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){const A=`An error has occured: ${t.status}`;throw new Error(A)}this.token=await t.json(),console.log(`JWT Token: ${this.token.access_token}`)}}};const Je=(0,k.Z)(Ie,[["render",De],["__scopeId","data-v-7a512a5c"]]);var Be=Je,Te={__name:"Register",setup(A){return(A,e)=>((0,n.wg)(),(0,n.j4)(Be))}};const Se=Te;var Qe=Se;const Pe=[{path:"/",name:"Home",component:O,meta:{requiresAuth:!0}},{path:"/about",name:"About",component:Ae,meta:{requiresAuth:!0}},{path:"/login",name:"Login",component:he},{path:"/register",name:"Register",component:Qe}],Ee=(0,D.p7)({history:(0,D.PO)("/"),routes:Pe});Ee.beforeEach(((A,e,t)=>{if(A.matched.some((A=>A.meta.requiresAuth))){const A=y.state.isAuthenticated;A?t():t({name:"Login"})}else t()}));var ze=Ee;t(2166);const _e=(0,a.ri)(C);_e.use(y),_e.use(ze),_e.mount("#app")},4762:function(A){A.exports="data:image/png;base64,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"},5440:function(A){A.exports="data:image/png;base64,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"}},e={};function t(a){var n=e[a];if(void 0!==n)return n.exports;var r=e[a]={exports:{}};return A[a].call(r.exports,r,r.exports,t),r.exports}t.m=A,function(){var A=[];t.O=function(e,a,n,r){if(!a){var o=1/0;for(c=0;c<A.length;c++){a=A[c][0],n=A[c][1],r=A[c][2];for(var l=!0,s=0;s<a.length;s++)(!1&r||o>=r)&&Object.keys(t.O).every((function(A){return t.O[A](a[s])}))?a.splice(s--,1):(l=!1,r<o&&(o=r));if(l){A.splice(c--,1);var i=n();void 0!==i&&(e=i)}}return e}r=r||0;for(var c=A.length;c>0&&A[c-1][2]>r;c--)A[c]=A[c-1];A[c]=[a,n,r]}}(),function(){t.n=function(A){var e=A&&A.__esModule?function(){return A["default"]}:function(){return A};return t.d(e,{a:e}),e}}(),function(){t.d=function(A,e){for(var a in e)t.o(e,a)&&!t.o(A,a)&&Object.defineProperty(A,a,{enumerable:!0,get:e[a]})}}(),function(){t.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(A){if("object"===typeof window)return window}}()}(),function(){t.o=function(A,e){return Object.prototype.hasOwnProperty.call(A,e)}}(),function(){t.r=function(A){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(A,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(A,"__esModule",{value:!0})}}(),function(){var A={143:0};t.O.j=function(e){return 0===A[e]};var e=function(e,a){var n,r,o=a[0],l=a[1],s=a[2],i=0;if(o.some((function(e){return 0!==A[e]}))){for(n in l)t.o(l,n)&&(t.m[n]=l[n]);if(s)var c=s(t)}for(e&&e(a);i<o.length;i++)r=o[i],t.o(A,r)&&A[r]&&A[r][0](),A[r]=0;return t.O(c)},a=self["webpackChunkvue_frontend"]=self["webpackChunkvue_frontend"]||[];a.forEach(e.bind(null,0)),a.push=e.bind(null,a.push.bind(a))}();var a=t.O(void 0,[998],(function(){return t(7652)}));a=t.O(a)})();
//# sourceMappingURL=app.546cb8d4.js.map