import { useLocation, useNavigate } from 'react-router-dom';
import Header from './component/Header';
import './index.css';


function App() {
  const navigate = useNavigate();
  const {state} = useLocation();
  const { data, position} = state;



const goNextpage = (destination,name) => {
   navigate('/route', { state: { start: position, end: destination,name:name } });
}

  return (
    <>
      <Header />
       <div className="card-grid">
         {
          data?.map((item) => {
            return (
              // item.id inside item geeting id 
              <div className="card" key={item.id}>
              <div className="text-part">
                 <h4>{item?.title}</h4>
                 <p>{item?.address?.label}</p>
                 <p>Service: {item?.categories[0]?.name}</p>
                 {/* <p>Contacts: {item?.contacts[0]?.phone[0]?.value}</p> */}
                 <p>Distance: {item?.distance}M</p>
              </div>
              <div className="img-part">
              <img src={`./${item?.categories[0]?.name}.jpg`} alt="" />
              </div>
              <button onClick={() => goNextpage(item.position,item?.categories[0]?.name)}>Get Route</button>
            </div>
            )
          })
         }
       </div>
       </>
        
  );
}

export default App;
