/* globals Chart:false, feather:false */

(function () {
  'use strict'

  feather.replace()

  Chart.pluginService.register({
    afterDatasetsDraw: function (chartInstance) {
      if (chartInstance.config.options.elements.center) {
        //Get ctx from string
        var ctx = chartInstance.chart.ctx;
        var rate = 0;

        chartInstance.data.datasets.forEach(function (dataset, i) {
                var meta = chartInstance.getDatasetMeta(i);
                if (!meta.hidden) {
                    meta.data.forEach(function(element, index) {
                        ctx.fillStyle = 'black';

                        var fontSize = 16;
                        var fontStyle = 'normal';
                        var fontFamily = 'Helvetica Neue';
                        ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);


                        var dataString = chartInstance.data.labels[index];
                        var dataString2 = dataset.data[index];

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';

                        var padding = 5;
                        var position = element.tooltipPosition();

                        ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                        ctx.fillText(dataString2, position.x, position.y - (fontSize / 2) - padding + fontSize);

                        rate = Math.round(dataset.data[0]/dataset.data[1] * 100)
                    });
                }
            });


        //Get options from the center object in options
        var centerConfig = chartInstance.config.options.elements.center;
        var fontStyle = centerConfig.fontStyle || 'Arial';
        var color = centerConfig.color || '#000';
        var sidePadding = centerConfig.sidePadding || 20;
        var sidePaddingCalculated = (sidePadding/100) * (chartInstance.innerRadius * 2)
        var txt = rate.toString()+" ";
        //var txt = centerConfig.text;
        //Start with a base font of 30px
        ctx.font = "30px " + fontStyle;

        //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        var stringWidth = ctx.measureText(txt).width;
        var elementWidth = (chartInstance.innerRadius * 2) - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        var widthRatio = elementWidth / stringWidth;
        var newFontSize = Math.floor(30 * widthRatio);
        var elementHeight = (chartInstance.innerRadius * 2);

        // Pick a new font size so it will not be larger than the height of label.
        var fontSizeToUse = Math.min(newFontSize, elementHeight);

        //Set font settings to draw it correctly.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centerX = ((chartInstance.chartArea.left + chartInstance.chartArea.right) / 2);
        var centerY = ((chartInstance.chartArea.top + chartInstance.chartArea.bottom) / 2)+3;
        ctx.font = fontSizeToUse+"px " + fontStyle;
        ctx.fillStyle = color;

        //Draw text in center
        ctx.fillText(txt, centerX, centerY);
        ctx.font = fontSizeToUse*0.5+"px " + fontStyle;
        ctx.fillText("%", centerX*1.11, centerY*1.04)
      }
    }
  });


  // Graphs
  var ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['lose','win'],
      datasets: [{
        data: [15339, 21345],
        backgroundColor: ['#C2185B',"#EC407A"],

      }]
    },
    options: {
      elements:{
        center: {
        //color: '#36A2EB', //Default black
        fontStyle: 'Helvetica', //Default Arial
        sidePadding: 50 //Default 20 (as a percentage)
        }
      },
      legend: {
        display: false
      },
      cutoutPercentage : 80,
      //plugins: labelplugin,
    }
  });
}());
