import '../Homepage/Home.css';
import '../Header.css'
import React, { PureComponent, useEffect, useState } from 'react';
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart, Pie, Sector, Cell,
} from 'recharts';
import Header from '../Header';

const datanew = [
    {
        name: 'Total Sales',
        uv: 590,
        pv: 800,
        color: "#1285d9",
    },
    {
        name: 'New Users',
        uv: 868,
        pv: 967,
        color: "#c4af1a",
    },
    {
        name: 'Total Products',
        uv: 1397,
        pv: 1098,
        color: "#b1a6a6",
    },
    {
        name: 'Conversation Rate',
        uv: 1480,
        pv: 1200,
        color: "#21af73",
    }
];



export default function Home() {

   

    const [dataPie, setDataPie] = useState([]);
    let [data, setData] = useState([]);

    data = [
        {   id : 1,
            name: 'Total Sales',
            icon: 'fa-solid fa-bolt',
            color: "#1285d9",
        },
        {   id : 2,
            name: 'New Users',
            icon: 'fa-solid fa-users',
            color: "#c4af1a",
        },
        {   id : 3,
            name: 'Total Products',
            icon: 'fa-solid fa-bag-shopping',
            color: "#b1a6a6",
        },
        {   id : 4,
            name: 'Conversation Rate',
            icon: 'fa-solid fa-chart-simple',
            color: "#21af73",
        }
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const COLORSPie = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    useEffect(() => {

        async function fetchdatas() {
            const postsapi = await fetch('https://jsonplaceholder.typicode.com/posts');
            let response = await postsapi.json()
            console.log(response);

            const formattedData = response.slice(0, 4).map((item, index) => ({
                name: `Group ${index + 1}`,
                value: item.id,
                // Use a relevant field for values
            }));

            setDataPie(formattedData);
        }
        fetchdatas();
    }, [])


    return (
        <div>
            <section className='homepage'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9 m-auto">


                            <div className="row">

                                {data.map((val) => (


                                    <div className="col-lg-3 m-auto">
                                        <div className="cards">
                                            <div className="cardsfirstdata" key={val.id}>
                                                <i class={val.icon} style={{ "color": val.color }}></i> &nbsp; &nbsp;<h6>{val.name}</h6>
                                            </div>
                                            <div className="cardsseconddata text-start">
                                                ₹12000
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-9 m-auto">
                            <div className="row mt-5">
                                <div className="col-lg-6 ">
                                    <div className="chartsdata">
                                        <h5  className='text-start cmode'>Sales Overview</h5>
                                        <ComposedChart
                                            width={500}
                                            height={400}
                                            data={datanew}
                                            margin={{
                                                top: 20,
                                                right: 80,
                                                bottom: 20,
                                                left: 20
                                            }}
                                        >
                                            <CartesianGrid stroke="#f5f5f5" />
                                            <XAxis
                                                dataKey="name"
                                                label={{ value: "Pages", position: "insideBottomRight", offset: 0 }}
                                                scale="band"
                                            />
                                            <YAxis label={{ value: "Index", angle: -90, position: "insideLeft" }} />
                                            <Tooltip />
                                            <Legend />
                                            <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
                                            <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                                            <Line type="monotone" dataKey="uv" stroke="#ff7300" />
                                        </ComposedChart>
                                    </div>

                                </div>
                                <div className="col-lg-6 ">
                                    <div className="chartsdata chartdatanew">
                                        <h5  className='text-start cmode' style={{ "color": "white" }}>Category Distribution</h5>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <PieChart width={400} height={400}>
                                                <Pie
                                                    data={dataPie}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={true}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                   
                                                >
                                                    {dataPie.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORSPie[index % COLORSPie.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip

                                                    contentStyle={{
                                                        backgroundColor: "grey",
                                                        borderColor: "grey",

                                                    }}
                                                    itemStyle={{ color: "white" }}


                                                />
                                                <Legend />
                                            </PieChart>

                                        </ResponsiveContainer>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
