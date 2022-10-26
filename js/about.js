
new Vue({
el: '#main',
data:{
    travelData:[], //總筆數
    select:"請選擇", //下拉選單
    showPage:1,//顯示第一頁
    pageTotal:0,//總頁碼
    travelDataPage:6,//一頁筆數
    travelDataTotalLen:0, //like 筆數
    isShow:false,
    travelId:null,
    travelSrc:"", //pop
    travelName:"",//pop
    travelTel:"",//pop
    travelAddress:"",//pop
    travelIntro:"",//pop
},
mounted() {
    let newDataTotal = localStorage.getItem('data') //抓值
    this.travelData = JSON.parse(newDataTotal) //變成物件
    this.travelDataTotalLen = this.travelData.length
    this.pageTotal = Math.ceil(this.travelDataTotalLen/this.travelDataPage) //page 按鈕總數量公式 總資料數量 / 每一頁要顯示的資料
},
computed: {
    travelDataNewList(){
        return this.travelData.slice((this.showPage-1)*6, (this.showPage-1)*6+6);
    },
},
template:`
<div>
        <div class="goBack">
            
        </div>
        <div class="headerSelect">
            <div>
                <div class="liked">
                    <a href="./index.html">返回列表</a>
                    <span>{{travelDataTotalLen}}</span>     
                </div>
            </div>
        </div>
        <div class="travelImgWrapper">
            <div class="travelImg_outer" v-for = "(travelDataList ,index) in travelDataNewList">
                <div class="travelImg">
                    <div class="travelImg_main">
                        <img :src='travelDataList.image' alt="">
                    </div>
                    <div class="main_name">
                        <h1>{{travelDataList.name}}</h1>
                    </div>
                    <div class="main_address">
                        <h3>{{travelDataList.address}}</h3>
                    </div>
                    <div class="main_address">
                        <h3>{{travelDataList.tel}}</h3>
                    </div>
                    <div class="main_introduction">
                        <h3 ellipsis>{{travelDataList.intro | ellipsis}}</h3>
                    </div>
                    <div class="btnSma">
                        <button class="btn-small" @click="edit(travelDataList.id,travelDataList.name,travelDataList.intro,travelDataList.address,travelDataList.tel,travelDataList.image,index)">編輯資料</button>
                        <button class="btn-small" @click="removeLove(travelDataList.id,travelDataList.name,travelDataList.intro,travelDataList.address,travelDataList.tel,index)">移除我的最愛</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="pagination">
            <ul class="pagination-ul">
                <li><a href="#" @click="left()"><i class="fa-solid fa-chevron-left"></i></a></li>
                <li v-for="(page,i) in pageTotal" ><a href="#" @click="pageid(page)">{{page}}</a></li>
                <li><a href="#" @click="right()"><i class="fa-solid fa-chevron-right"></i></a></li>
            </ul>
        </div>

        <div class="contactUSInner" v-if="isShow" @click="isClose"></div>
        <div class="card contactUSInnerCard" v-if="isShow">
            <ul class="cardUl" >
                <li>
                    <h1 class="cardH1">編輯資料</h1>
                </li>
            </ul>
            <div class="cardInner">
                    <div class="travelImg_main">
                        <img alt="" :src="travelSrc">
                    </div>
                <div class="travelInput">
                    <div><label>名稱：</label><br><input v-model="travelName"></input></div>
                    <div><label>地址：</label><br><input v-model="travelAddress"></input></div>
                    <div><label>電話：</label><br><input v-model="travelTel"></input></div>
                    <div><label>介紹：</label><br><textarea v-model="travelIntro" class="travelIntro"></textarea></div>
                </div>
                <div class="btna3" @click="save()">儲存</div>
            </div>
        </div>

</div>
`,
methods: {
    isClose(){
        this.isShow = !this.isShow
    },
    edit(id,name,intro,address,tel,image,index){
        this.travelId = id
        this.travelTel = tel
        this.travelSrc = image
        this.travelName = name
        this.travelAddress = address
        this.travelIntro = intro
        this.isShow = !this.isShow
        
    },
    save(){
        let patternPhone =  /^(09)[0-9]{8}$/;
        if(this.travelName == "" || this.travelAddress == "" || this.travelIntro == "" || this.travelTel == ""){
            swal({
                title: "請輸入完整資訊",
                icon: "error",
            });
        }else if(this.travelIntro.length < 100){
            swal({
                title: "景點介紹不能低於100字",
                icon: "error",
            });
        }else if(!patternPhone.test(this.travelTel)){
            swal({
                title: "請輸入正確的手機格式",
                icon: "error",
            });
        }else{
            this.travelData.filter((element,index,arr) => {
            if(this.travelId == element.id){
                element.name = this.travelName
                element.intro = this.travelIntro
                element.address = this.travelAddress
                element.tel = this.travelTel
                return this.travelData
            }
            });
            localStorage.setItem('data',JSON.stringify(this.travelData))
            swal({
                title: "已儲存",
                icon: "success",
            });
            this.isShow = !this.isShow
        }
    },
    removeLove(id,name,intro,address,tel,index){
        let dataId = id
        this.travelData = this.travelData.filter(function(item) {
                return item.id != dataId
        });
        localStorage.setItem('data',JSON.stringify(this.travelData))
        alert('已從我的最愛移除')
        this.travelDataTotalLen = this.travelData.length
    },
    left(){
        this.showPage--
        if(this.showPage<=0){
            this.showPage= 1
        }
        this.select="請選擇"
    },
    right(){
        this.showPage++
        if(this.showPage >= this.pageTotal){
            this.showPage=  this.pageTotal
        }
        this.select="請選擇"
    },
    pageid(i){
        this.showPage = i
        this.select="請選擇"
    },
},
    filters:{
        ellipsis(value){
            if (!value) return '';
            if (value.length > 10) {
                return value.slice(0,175) + '...'
            }
            return value
        }
    },
})
