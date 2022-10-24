
    new Vue({
    
    el: '#main',

    data:{
        travelData:[], //總筆數
        travelDataId:[], //include ID
        travelDataTotal:[], //like
        newDataId:[], // mounted ID
        newTravelDataTotal:[], // mounted like
        select:"請選擇", //下拉選單
        showPage:1,//顯示第一頁
        travelDataLength:null,//資料長度
        pageTotal:0,//總頁碼
        travelDataPage:8,//一頁筆數
        travelDataTotalLen:0//like 筆數
    },
    mounted() {
        fetch('./response_1666164148531.json',{
                method: 'GET',
                headers: { "Content-Type": "application/json"},
            })  
        .then((response) => {
            return response.json();
        })
        .then((userArr) => {
            console.log(userArr.data);
            this.travelData = userArr.data
            let newDataTotal = localStorage.getItem('data') //抓值
            this.newTravelDataTotal = JSON.parse(newDataTotal) //變成物件
            if(this.newTravelDataTotal !== null){
                this.travelDataTotal = this.newTravelDataTotal
            }
            this.travelDataTotalLen = this.travelDataTotal.length
            this.travelDataLength = this.travelData.length //資料長度
            this.pageTotal = Math.ceil(this.travelDataLength/this.travelDataPage) //page 按鈕總數量公式 總資料數量 / 每一頁要顯示的資料
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        })
    },
    computed: {
        travelDataNewList(){
            const vw = this;
            this.travelData.slice((this.showPage-1)*8, (this.showPage-1)*8+8);
            if (this.select === "請選擇") {
                return this.travelData.slice((this.showPage-1)*8, (this.showPage-1)*8+8);
            }else{
                let resultArr = [...this.travelData];

                if (this.select !== "請選擇") {
                    resultArr = resultArr.filter(function(item){
                        return item.id == vw.select
                    })
                }
                return resultArr;
            }
        },
    },
    template:`
    <div>
            <div class="headerSelect">
                <div>
                    <div class="liked">
                        <a href="./about.html">我的最愛</a>
                        <span>{{travelDataTotalLen}}</span>     
                    </div>
                    <select name="" id="" v-model="select">
                        <option value="請選擇" selected>請選擇</option>
                        <option :value='travelDataId.id' v-for="travelDataId in travelData">{{travelDataId.id}}</option>
                    </select>
                </div>
            </div>
            <div class="travelImgWrapper">
                <div class="travelImg_outer" v-for = "(travelDataList ,index) in travelDataNewList">
                    <div class="travelImg">
                        <div class="travelImg_main">
                            <img :src='travelDataList.images[0].src' alt="">
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
                            <h3 ellipsis>{{travelDataList.introduction | ellipsis}}</h3>
                        </div>
                        <div class="btnSma">
                            <button class="btn-small" @click="addLove(travelDataList.id,travelDataList.name,travelDataList.introduction,travelDataList.address,travelDataList.tel,index,travelDataList.images[0].src)">加到我的最愛</button>
                            <button class="btn-small" @click="removeLove(travelDataList.id,travelDataList.name,travelDataList.introduction,travelDataList.address,travelDataList.tel,index,travelDataList.images[0].src)">移除我的最愛</button>
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
    </div>
    `,
    methods: {
        addLove(id,name,intro,address,tel,index,image){

            let travelDataId = {
                    "id": id,
                    "name": name, 
                    "intro": intro,
                    "address":address,
                    "tel":tel,
                    "image":image
            };
            this.travelDataTotal.push(travelDataId)
            this.travelDataTotal = [...new Set(this.travelDataTotal.map(item => JSON.stringify(item)))].map(item => JSON.parse(item));
            localStorage.setItem('data',JSON.stringify(this.travelDataTotal))
            alert('加到我的最愛')
            this.travelDataTotalLen = this.travelDataTotal.length
        },
        removeLove(id,name,intro,address,tel,index){
            let dataId = id
            this.travelDataTotal = this.travelDataTotal.filter(function(item) {
                    return item.id != dataId
            });
            localStorage.setItem('data',JSON.stringify(this.travelDataTotal))
            alert('已從我的最愛移除')
            this.travelDataTotalLen = this.travelDataTotal.length
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
