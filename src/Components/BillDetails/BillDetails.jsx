import React, { use, useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import SmartBillContext from "../../Context/SmartBillContext";
import { toast } from "react-toastify";

const BillDetails = () => {
  const { fireBaseUser } = use(SmartBillContext);
  const [transictions, setTransictions] = useState([]);
  useEffect(() => {
    fetch(`https://smartbill-managment-server.onrender.com/transiction/${fireBaseUser?.uid}`)
      .then((res) => res.json())
      .then((data) => setTransictions(data));
  }, [fireBaseUser?.uid]);
  const bill = useLoaderData();
  const handlePayNow = () => {
    let now = new Date();
    let date = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    let time = now.toLocaleTimeString();
    const payCode = Math.floor(100000 + Math.random() * 900000);
    const transictionInformation = {
      bill_id: bill._id,
      bill_type: bill.bill_type,
      organization: bill.organization,
      amount: bill.amount,
      due_date: bill.due_date,
      uid: fireBaseUser?.uid,
      date,
      time,
      payCode,
    };
    fetch(`https://smartbill-managment-server.onrender.com/bill/${bill._id}`, {
        method:"POST",
        headers:{
          "content-type":"application/json"
        },
        body: JSON.stringify(transictionInformation)
    }

    ).then((res) => res.json())
    .then((data) => {
      const isAlreadyPaid = transictions.filter(transiction => transiction.bill_id === bill._id);
      if(isAlreadyPaid.length > 0){
        return toast.error("You have already paid this bill");
      } else {
        if(data.insertedId){
          toast.success("Payment Successful");
        }
      }
    })
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Bill Details
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Bill Type:</span>
          <span className="text-blue-600 font-semibold capitalize">
            {bill.bill_type}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Organization:</span>
          <span className="text-gray-700 font-semibold">
            {bill.organization}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Amount:</span>
          <span className="text-green-600 font-bold text-xl">
            ৳ {bill.amount}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Due Date:</span>
          <span className="text-gray-700 font-semibold">{bill.due_date}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Bill ID:</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            {bill._id}
          </span>
        </div>
        <div className="flex justify-center">
          <button onClick={() => handlePayNow()} className="btn btn-primary">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;
