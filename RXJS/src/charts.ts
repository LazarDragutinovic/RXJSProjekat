import { Chart, registerables} from "chart.js";
import { fromEvent } from "rxjs";
import { Position } from "./models/positions";

Chart.register(...registerables);




let drawChart = (parrent: HTMLElement, showStatsBtn: HTMLButtonElement)=>{
    let canvas : HTMLCanvasElement = document.createElement("canvas");
    let canvasContainer : HTMLDivElement = document.createElement("div");
    canvasContainer.className = "CanvasForStatsContainer"
    parrent.appendChild(canvasContainer);



    canvasContainer.style.display = 'none';
    let canvasShow: boolean = false;
    
    
    
    fromEvent(showStatsBtn,"click").subscribe(()=>{
        let showStatsRed : string = "show-stat-btn--red";
        if(canvasShow) {
            canvasContainer.style.display = 'none';
            canvasShow = false;
            showStatsBtn.classList.remove(showStatsRed)
            showStatsBtn.textContent = "Hide statisticks";
        }
        else {
            canvasContainer.style.display = 'block';
            canvasShow = true;
            showStatsBtn.classList.add(showStatsRed);
            showStatsBtn.textContent = "Show statisticks"
        }
    })
    canvas.className = "CanvasForStats";
    canvas.width = 700;
    canvas.height = 450;
    Chart.defaults.color = "white";
    canvasContainer.appendChild(canvas);

    let ctx = canvas.getContext("2d");
    let chart = new Chart(ctx,{
        type:'bar',
        data:{
            labels:[],
            datasets:[{
                data:[]
            },
            {
                data:[],
                hidden:true
            },
            {
                data:[],
                hidden:true
            },
            {
                data:[],
                hidden:true
            },
            {
                data:[],
                hidden:true
            },]
        },
        options:{ 
            backgroundColor:"white",
        },
    });
    chart.draw()
    return chart;

} 

export default drawChart;