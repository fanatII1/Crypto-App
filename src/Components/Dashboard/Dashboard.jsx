import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import DashboardChart from './DashboardChart/DashboardChart';
import './Dashboard.css'

let requestUrl = 'https://api.coingecko.com/api/v3';

function Dashboard() {
  let [coins, setCoins] = useState(null);
  let [coinValue, setCoinValue] = useState('bitcoin');
  let [monthlyChart, setMonthlyChart] = useState(null);
  let [newsData, setNewsData] = useState()
  let navigate = useNavigate();

  // on initial render we fetch crypto coins
  // sort from highest to lowest (by market cap)
  // and return the top 10
  // also fetch latest crypto news on the market
  useEffect(()=>{
    async function fetchCoinData(){
      //fetch crypto coins
      let response = await fetch(`${requestUrl}/coins/markets?vs_currency=zar&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
      let coinData = await response.json();
      coinData.sort(function(a, b){return b.market_cap - a.market_cap})
      let topTenCoins = coinData.filter((coin, index)=> index < 10);
      setCoins(topTenCoins)

      //fetch news
      let news_response = await fetch('https://newsapi.org/v2/top-headlines?country=za&category=business&apiKey=ddd641f1408349fb94c54c9d76fa8738');
      let news_data = await news_response.json();
      let {articles} = news_data;
      let threeArticles = articles.filter((article, index)=> index < 3);
      setNewsData(threeArticles)
    }

    fetchCoinData();
  }, [])


  //onChange sets state to the specific coin selected
  const handleChange = (e) =>{
    setCoinValue(e.target.value)
  }

  //after specific coin is selected, we fetch its historical data(coin price) over the past 12 months(OCT to SEP)
  //since the date is in unix timestamp format, we convert it to human readable date
  //and we collect the data(price) of each month, starting from the 16th of each month
  useEffect(()=>{
    async function coinChartData(){
      let monthsResponse = await fetch(`${requestUrl}/coins/${coinValue}/market_chart/range?vs_currency=zar&from=1634301328&to=1665837328`)
      let monthsCoin = await monthsResponse.json();
      let months = [];
      let monthNum = 0;
      monthsCoin.prices.forEach((date)=>{
        let timeStampDate = date[0];
        let humanDate = new Date(timeStampDate);
        let day = humanDate.getDate();
        let lastTwelveMonths = ['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'];
        //push the data(price) of each coin into months array every 16th day of the month
        if(day === 16){
          months.push({date: `${lastTwelveMonths[monthNum++]}`, price: date[1]})
        }
      });

      setMonthlyChart(months)
    }
    coinChartData();
  }, [coinValue])

  
  //onClick goes to the specific coin page
  //also passing the chart data and coinDetails as state
  //will be used to display chart of specific coin
  const toDetailsPage = (e, coinName)=>{
    let coinDetails = coins.find((coin)=> coinName === coin.name)

    navigate(coinName,{
      state: {
        coinsTopTen: coins,
        coinDetails: coinDetails,
        monthlyChart: monthlyChart,
      }
    })
  }

  if(coins === null){
    return <></>
  }
  else{
    
    return (
      <div id='main-container'>
        <main id='main-crypto-content'>

          <div id='welcoming-content'>
            <h1 className='welcome-heading'>Welcome,</h1>
            <div id='crypto-connect'>
              <select className='coin-select' onChange={handleChange}>
                {
                  coins.map((coin)=>{
                    return <option className='coin' value={coin.id}>{coin.name}</option>
                  })
                }
              </select>
              <button className='connect-wallet'>Connect Wallet</button>
            </div>
          </div>

          <article id='crypto-article'>  

            <section id='coins-information'>
              <h1 className="Latest-heading">LATEST:</h1>

              <div className='coin-chart'>
                <DashboardChart monthlyChart={monthlyChart}/>
              </div>

              <div className='top-ten-coins'>
                <ul id='top-ten-coinsList'>
                {
                  coins.map((coin, key)=>{
                    let coinName = coin.name;
                    return(
                      <li className='top-ten-coin-list-item' key={key} onClick={(e, coin)=> toDetailsPage(e, coinName)}>
                        <div className='coin-image-container'>
                          <img src={coin.image} alt='coin' className='coin-image' />
                        </div>
                        <h3 className='coin-name'>{coin.name}</h3>
                        <h3 className='coin-price'>R{coin.current_price}</h3>
                        <h3 className='coin-marketCap'>R{coin.market_cap}</h3>
                        <h3 className='coin-info'>i</h3>
                      </li>
                    )
                  })
                }
                </ul>
              </div>

            </section> 


                        <aside id='latest-crypto-news'>
              {
                (typeof newsData === 'undefined') ? (<></>): (
                  newsData.map((article)=>{
                    console.log(article)
                    return(
                      <div className="article">

                        <div className="article-image-container">
                          <img src={article.urlToImage} alt="article" className='article-image'/>
                          <div className="article-image-overlay">
                            <a href={article.url} className="article-link">{article.title}</a>
                          </div>
                        </div>

                      </div>
                    )
                  })
                )
              }
            </aside>      
          </article>       
        </main>
      </div>
    )
  }
}

export default Dashboard