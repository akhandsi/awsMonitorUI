import {Card, Elevation} from "@blueprintjs/core";
import {scaleTime} from 'd3-scale';
import * as moment from 'moment';
import * as React from 'react';
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import {TFunction} from "../../typings/lang";
import {EmptySummary} from "./EmptySummary";
import './UI.css';

interface IMetricTrendProps {
    metric: any;
    onClick?: TFunction<any, any>;
    chartWidth?: number;
    chartHeight?: number;
}

export class MetricTrend extends React.Component<IMetricTrendProps, any> {

    public getTicks (data: any[]) {
        if (!data || !data.length ) {
            return [];
        }

        const domain = [new Date(data[0].time), new Date(data[data.length - 1].time)];
        const scale = scaleTime().domain(domain).range([0, 1]);
        const ticks = scale.ticks(1);
        return ticks.map(entry => +entry);
    }

    public getTicksData (data: any, ticks: any) {
        if (!data || !data.length ) {
            return [];
        }
        const dataMap = new Map(data.map((i: any) => [i.timestamp, i]));

        ticks.forEach((item: any) => {
            if(!dataMap.has(item)) {
                data.push({timestamp: item});
            }
        });
        return data;
    }

    public render() {

        const dateFormat = (time: any) => moment(time).format('HH:mm Do');

        const sortData = (data: any) => data.sort((a: any, b: any) => a.timestamp - b.timestamp);

        const item = this.props.metric;
        const chartWidth: number = this.props.chartWidth ? this.props.chartWidth : 340;
        const chartHeight: number = this.props.chartHeight ? this.props.chartHeight : 250;

        if (item.stats.length > 0) {
            const sortedData = sortData(item.stats);
            const ticksArr = this.getTicks(sortedData);
            const completeData = this.getTicksData(sortedData, ticksArr);
            const completeSortedData = sortData(completeData);

            const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
                if (this.props.onClick) {
                    return this.props.onClick(item);
                }
            };

            return (
                <Card key={item._id} interactive={true} elevation={Elevation.TWO} className="Card" onClick={onClick}>
                    <h5>{item.name}</h5>
                    <LineChart width={chartWidth} height={chartHeight} data={completeSortedData}
                               margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="timestamp" ticks={ticksArr} tickCount={ticksArr.length} tickFormatter={dateFormat}/>
                        <YAxis/>
                        <Tooltip labelFormatter={dateFormat}/>
                        <Legend/>
                    </LineChart>
                </Card>
            );
        }

        return (<EmptySummary/>);
    }
}
