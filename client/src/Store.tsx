import { useEffect, useState } from 'react'
import instance from './api';
import { InventoryItem, Store } from './types';
import { Link } from 'react-router-dom';

function Store() {
    const [data, setData] = useState<Store[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    async function fetchStore() {
      const res = await instance.get('store');
      setData(res.data);
      setInventory(res.data.map((item: Store) => { return { ItemId: item.ItemID, Quantity: 0 }}));
    }
    fetchStore();
  }, []);

  const addToInventory = () => instance.post('inventory', {inventory: inventory.filter(i => i.Quantity > 0)});
  
  const changeQuantity = (idx: number, change: number) => {
    const tempArray = inventory.slice();
    if (tempArray[idx].Quantity + change < 0 || tempArray[idx].Quantity + change > data[idx].Quantity) return;
    tempArray[idx] = {...tempArray[idx], Quantity: tempArray[idx].Quantity + change};
    setInventory(tempArray);
  }

  return (
    <div className='mx-auto max-w-2xl pb-20'>
        {inventory.filter(item => item.Quantity > 0).length ? <button onClick={addToInventory} className="fixed bottom-5 left-1/2 -translate-x-1/2 shadow-xl w-96 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add to inventory</button> : ''}
        
        <div className="flex justify-between">
            <h3 className='text-3xl pb-5'>Inventory Management System</h3>
            <Link to={'inventory'} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">My Inventory</Link>
        </div>
        
        {data.map((item, idx) => {
            return (
            <div key={item.ItemID + ""} className="my-5 flex flex-col bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-2xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <img className="object-cover h-full rounded-lg m-3" src={item.Thumbnail} alt="Thumbnail" />
                <div className="flex flex-col items-start justify-between p-4 leading-normal">
                    <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">{item.ItemName}</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item.Category ? 'Category: ' + item.Category : ''}</p>
                    <p className='mb-3'><span className="text-3xl font-bold text-gray-900 dark:text-white">₹{item.Price}</span>/{item.Unit}</p>
                    <div className="relative flex items-center max-w-[8rem]">
                        <button onClick={() => changeQuantity(idx, -1)} type="button" id="decrement-button" data-input-counter-decrement="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 text-2xl flex items-center focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">-</button>
                        <input value={inventory[idx].Quantity} readOnly type="text" id="quantity-input" data-input-counter aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="999" required />
                        <button onClick={() => changeQuantity(idx, 1)} type="button" id="increment-button" data-input-counter-increment="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 text-2xl flex items-center focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">+</button>
                    </div>
                </div>
            </div>
            );
        })}
    </div>
  )
}

export default Store