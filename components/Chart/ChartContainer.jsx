import Plotly from "plotly.js-dist-min";
import React, { useEffect } from "react";
import Web3 from "web3";
import { useData } from "../../contexts/DataContext";

const ChartContainer = ({ questionId }) => {
  const { betmarket } = useData();

  const fetchGraphData = async () => {
    var data = await betmarket.methods.getGraphData(questionId).call();
    var yesData = {
      time: [],
      amount: [],
    };
    var noData = {
      time: [],
      amount: [],
    };
    data["0"].forEach((item) => {
      var sum = yesData.amount.reduce((a, b) => a + b, 0);
      yesData.amount.push(
        sum + parseFloat(Web3.utils.fromWei(item[1], "ether"))
      );
      yesData.time.push(new Date(parseInt(item[2] + "000")));
    });
    data["1"].forEach((item) => {
      var sum = noData.amount.reduce((a, b) => a + b, 0);
      noData.amount.push(
        sum + parseFloat(Web3.utils.fromWei(item[1], "ether"))
      );
      noData.time.push(new Date(parseInt(item[2] + "000")));
    });

    var yes = {
      x: [...yesData.time],
      y: [...yesData.amount],
      mode: "lines+markers",
      name: "Yes",
    };

    var no = {
      x: [...noData.time],
      y: [...noData.amount],
      mode: "lines+markers",
      name: "No",
    };
    var chartData = [yes, no];

    var layout = {
      title: "YES / NO Graph",
    };

    Plotly.newPlot("myDiv", chartData, layout, { displayModeBar: false });
  };

  useEffect(() => {
    fetchGraphData();
  });

  return (
    <>
      <div id="myDiv"></div>
    </>
  );
};

export default ChartContainer;
