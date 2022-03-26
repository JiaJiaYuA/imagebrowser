var allIndustoryData = [];
var allIndustoryData1 = [];
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_blhy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_cbzz"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_cmyl"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_dlhy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_dqhy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_dzqj"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_dzxx"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_fdc"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_fdsb"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_fjzz"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_fzhy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_fzjx"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_fzxl"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_glql"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_gsgq"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_gthy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_hbhy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_hghy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_hqhy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_jdhy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_jdly"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_jjhy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_jrhy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_jtys"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_jxhy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_jzjc"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_kfq"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_ljhy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_mtc"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_mthy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_nlmy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_nyhf"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_qczz"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_qtxy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_slzp"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_snhy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_sphy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_stock"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_swzz"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_sybh"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_syhy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_tchy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_wzwm"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_ylqx"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_yqyb"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_ysbz"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_ysjs"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_zhhy"]);
	allIndustoryData.push(S_Finance_bankuai_sinaindustry["new_zzhy"]);

for(let i = 0; i < allIndustoryData.length; i++)
{
	var singleIndusoryData1 = [];
    var elementsIndustory = [];
    elementsIndustory=allIndustoryData[i].split(",");
    singleIndusoryData1.push(elementsIndustory[1]);
    singleIndusoryData1.push(Math.floor(parseFloat(elementsIndustory[5])*100)/100.);
    allIndustoryData1.push(singleIndusoryData1);
}

allIndustoryData1.sort(function (a,b) {
        if (a[1] < b[1] ) {           // 按某种排序标准进行比较, a 小于 b
            return 1;
        }
        if (a[1] > b[1] ) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });
