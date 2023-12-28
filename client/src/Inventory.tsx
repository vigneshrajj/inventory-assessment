import { useEffect, useState } from 'react'
import instance from './api';
import { Inventory } from './types';
import { Link } from 'react-router-dom';

function Inventory() {
  const [data, setData] = useState<Inventory[]>([]);

  useEffect(() => {
    async function fetchStore() {
      const res = await instance.get('inventory');
      setData(res.data);
    }
    fetchStore();
  }, []);
  return (
    <div className='mx-auto max-w-2xl'>
      <div className="flex justify-between">
        <h3 className='text-3xl pb-5'>My Inventory</h3>
        <Link to={'/'} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Store</Link>
      </div>
      {data.map((item) => {
        return (
          <div key={item.ItemID + ""} className="my-5 flex flex-col bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-2xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              <img className="object-cover h-full rounded-lg m-3" src={item.Thumbnail} alt="Thumbnail" />
              <div className="flex flex-col items-start justify-start p-4 leading-normal">
                  <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">{item.ItemName}</h5>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item.Category ? 'Category: ' + item.Category : ''}</p>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Quantity: {item.Quantity}</p>
                  <p className='mb-3'><span className="text-3xl font-bold text-gray-900 dark:text-white">₹{item.Price}</span>/{item.Unit}</p>
              </div>
          </div>
        );
      })}
    </div>
  )
}

export default Inventory
