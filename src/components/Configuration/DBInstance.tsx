import {Card, Classes, Elevation, Icon} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import axios, {AxiosResponse} from 'axios';
import * as React from 'react';
import {ITopologyNode, NodeClass} from "../../models/model";
import {TIconNameOrJSX, TStringOrNumber} from "../../typings/lang";
import {TopologyItemMetrics} from "../TopologyItem/TopologyItemMetrics";
import {EmptySummary} from "../UI/EmptySummary";
import './../UI/UI.css';

export class DBInstance implements ITopologyNode {

    public static getCards(instances: any[]): JSX.Element {
        const cardItems = instances.map ((instance: any) => {
            return (
                <Card key={instance._id} interactive={true} elevation={Elevation.TWO} className="Card">
                    <h5>{instance.name}</h5>
                    <div className="CardContentContainer">
                        <div className="CardContent">
                            <ul className={Classes.LIST_UNSTYLED}>
                                <li>InstanceType: {instance.instanceType}</li>
                                <li>Engine: {instance.engine} {instance.engineVersion}</li>
                                <li>Storage Type: {instance.storageType}</li>
                                <li>Allocated Storage: {instance.allocatedStorage} GiB</li>
                                <li>Status: {instance.status}</li>
                            </ul>
                        </div>
                        <div className="CardContent CardContentRight">
                            <Icon icon={IconNames.DATABASE} iconSize={Icon.SIZE_LARGE}/>
                        </div>
                    </div>
                </Card>
            );
        });

        if (cardItems.length > 0) {
            const time = new Date().getTime();
            return (<div key={`dbInstance_${time}`} className="CardContainer">{cardItems}</div>);
        }

        return (<EmptySummary/>);
    }

    public id: TStringOrNumber;
    public label: string;
    public countSummary: any;
    public type: any;

    constructor(){
        this.id = 3;
        this.countSummary = {};
        this.type = NodeClass.DB_INSTANCE;
    }

    public async getSummaryData(node: ITopologyNode, params: any): Promise<Array<AxiosResponse<any[]>>> {
        return await Promise.all([axios.post(`/dbInstance/${node.id}/metrics`, {inputDTO: params})]);
    }

    public createNodeSummaryElement(node: ITopologyNode, metrics: any[], filterStr: string): JSX.Element {
        return (<TopologyItemMetrics node={node} metrics={metrics}/>);
    }

    public getIcon(node: ITopologyNode): TIconNameOrJSX {
        return IconNames.DATABASE;
    }

    public isExpandable(node: ITopologyNode): boolean {
        return false;
    }
}
