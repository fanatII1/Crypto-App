import React, { useEffect, useState } from 'react'
import './Details.css'
import { useLocation } from 'react-router-dom'
import DashboardChart from '../Dashboard/DashboardChart/DashboardChart';

let requestUrl = 'https://api.coingecko.com/api/v3';
//Component displays details about selected coin
function Details() {
  let [vsCurrencySelect, setVsCurrencySelect] = useState(null)
  let [monthlyChart, setMonthlyChart] = useState();
  let location = useLocation();
  let {state} = location;
  let {coinDetails} = state;
  
  //defining the color of the price change(%) if + or -(less than 0)
  let price_percentage_styles = {
    color : coinDetails.price_change_percentage_24h < 0 ? 'red' : '#00df00'
  }

  // on initial render, we fetch its historical data(coin price) over the past 12 months(OCT to SEP)
  // data will be used to map the coin's chart(using ChartJS library)
  // since the date is in unix timestamp format, we convert it to human readable date
  // and we collect the data(price) of each month, starting from the 16th of each month
  useEffect(()=>{
    async function fetchChartData(){
      let monthsResponse = await fetch(`${requestUrl}/coins/${coinDetails.id}/market_chart/range?vs_currency=zar&from=1634301328&to=1665837328`)
      let monthsCoin = await monthsResponse.json();
      let months = [];
      let monthNum = 0;
      monthsCoin.prices.forEach((date)=>{
        let timeStampDate = date[0];
        let humanDate = new Date(timeStampDate);
        let day = humanDate.getDate();
        let lastTwelveMonths = ['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'];
        if(day === 16){
          months.push({date: `${lastTwelveMonths[monthNum++]}`, price: date[1]})
        }
      });
      
      setMonthlyChart(months)
    }
    fetchChartData()

  }, [coinDetails])

  // onSelect we fetch the vs_currency(comparing currency) and set it to state
  // the api returns the compared currency price
  const vsCurrency = async (e) =>{
    let vsCurrency_id = e.target.value
    console.log(coinDetails)
    await fetch(`${requestUrl}/coins/${coinDetails.id}/market_chart?vs_currency=${vsCurrency_id}&days=1`)   
    .then((res)=> res.json())
    .then((data)=>{
      console.log(data)
      setVsCurrencySelect(data)
    })
  }


  return (
    <main id='Details-content'>

      <section id='summary-market-details'>
        <div className='crypto-summary-headings'>
          <h2 className='crypto-select-name'>
            <img src={coinDetails.image} alt="" />
            {coinDetails.name}
          </h2>
          <h3 className='crypto-select-price'>
            Price: {vsCurrencySelect === null ? coinDetails.current_price :  vsCurrencySelect.prices[0][1].toFixed(2)}
            <span id='price-change' style={price_percentage_styles}>24H +/- : {coinDetails.price_change_percentage_24h}%</span>
          </h3>
          <h4 className="market-rank">Market Rank: {coinDetails.market_cap_rank}</h4>
        </div>

        <div className='vs-currency-container'>
          <select id='vs-currency-converter' onChange={vsCurrency}>
            <option value="zar">Rands</option>
            <option value="eur">Euro</option>
            <option value="gbp">British Pound</option>
            <option value="eth">Ethereum</option>
            <option value="btc">Bitcoin</option>
          </select>
        </div>
      </section>

      <section id='inDepthDetails'>
        <div className='market-cap depth-container'>
          <h4 className='market-cap-heading depth-detail-heading'>Market Cap:</h4>
          <p className='market-cap-price depth-detail-text'>R: {coinDetails.market_cap}</p>
        </div>

        <div className='volume depth-container'>
          <h4 className='volume-heading depth-detail-heading'>Total Volume:</h4>
          <p className='volume-price depth-detail-text'>R: {coinDetails.total_volume}</p>
        </div>


        <div className='diluted-valuation depth-container'>
          <h4 className='diluted-heading depth-detail-heading'>Total Volume:</h4>
          <p className='diluted-valuation depth-detail-text'>R: {coinDetails.fully_diluted_valuation}</p>
        </div>
      </section>

      <section id="selected-coin-chart">
      {
        (typeof monthlyChart === 'undefined') ? (<></>) :
        (
        <DashboardChart monthlyChart={monthlyChart}/>
        
        )
      }
      </section>

    </main>
  )
}

export default Details