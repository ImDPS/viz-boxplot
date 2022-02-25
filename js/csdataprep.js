function genType(d) {
  d.price_date = parseDate(d.price_date);
  d.min_price = +d.min_price;
  d.max_price = +d.max_price;
  d.OPEN = +d.OPEN;
  d.CLOSE = +d.CLOSE;
  d.TURNOVER = +d.TURNOVER;
  d.VOLATILITY = +d.VOLATILITY;
  return d;
}

function timeCompare(date, interval) {
  if (interval == "week") {
    var durfn = d3.time.monday(date);
  } else if (interval == "month") {
    var durfn = d3.time.month(date);
  } else {
    var durfn = d3.time.day(date);
  }
  return durfn;
}

function dataCompress(data, interval) {
  var compressedData = d3
    .nest()
    .key(function (d) {
      return timeCompare(d.price_date, interval);
    })
    .rollup(function (v) {
      return {
        price_date: timeCompare(d3.values(v).pop().price_date, interval),
        OPEN: d3.values(v).shift().OPEN,
        min_price: d3.min(v, function (d) {
          return d.min_price;
        }),
        max_price: d3.max(v, function (d) {
          return d.max_price;
        }),
        CLOSE: d3.values(v).pop().CLOSE,
        TURNOVER: d3.mean(v, function (d) {
          return d.TURNOVER;
        }),
        VOLATILITY: d3.mean(v, function (d) {
          return d.VOLATILITY;
        }),
      };
    })
    .entries(data)
    .map(function (d) {
      return d.values;
    });

  return compressedData;
}
// csheader.js
function csheader() {
  function cshrender(selection) {
    selection.each(function (data) {
      var interval = TIntervals[TPeriod];
      var format =
        interval == "month"
          ? d3.time.format("%b %Y")
          : d3.time.format("%b %d %Y");
      var dateprefix =
        interval == "month"
          ? "Month of "
          : interval == "week"
          ? "Week of "
          : "";
      d3.select("#infodate").text(dateprefix + format(data.price_date));
      d3.select("#infoopen").text("O " + data.OPEN);
      d3.select("#infohigh").text("H " + data.max_price);
      d3.select("#infolow").text("L " + data.min_price);
      d3.select("#infoclose").text("C " + data.CLOSE);
    });
  } // cshrender

  return cshrender;
} // csheader
