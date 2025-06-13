import Navbar from "../../components/Navbar";

const Home = () => {
    return (
        <>
      <Navbar title="Home"  className="top-0 absolute"/>
        <div className="pt-5">
        <h2 className="text-lg font-medium mb-4">Welcome to the Dashboard</h2>
        <div className="bg-white p-4 rounded shadow w-60 mb-6">
          <p>Total Sales</p>
          <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">Add Invoice</button>
        </div>
  
        <div className="bg-white p-6 rounded shadow">
          <p>Bar Chart</p>
          {/* Add chart here later */}
        </div>
      </div>
      </>
    );
  };
  
  export default Home;
  