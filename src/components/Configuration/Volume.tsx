import {Card, Classes, Elevation, Icon} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import axios, {AxiosResponse} from 'axios';
import * as React from 'react';
import {ITopologyNode, NodeClass} from "../../models/model";
import {TIconNameOrJSX, TStringOrNumber} from "../../typings/lang";
import {TopologyItemMetrics} from "../TopologyItem/TopologyItemMetrics";
import {EmptySummary} from "../UI/EmptySummary";
import './../UI/UI.css';

export class Volume implements ITopologyNode {

    public static getCards(volumes: any[]): JSX.Element {
        const cardItems = volumes.map ((volume: any) => {
            const attachments: JSX.Element[] = (volume.attachment || []).map((attachment: any) => {
                return (<div key={attachment._id}>
                    <ul className={Classes.LIST_UNSTYLED}>
                        <li>Device: {attachment.device}</li>
                        <li>InstanceId: {attachment.instanceId}</li>
                        <li>State: {attachment.state}</li>
                    </ul>
                </div>);
            });

            return (
                <Card key={volume._id} interactive={true} elevation={Elevation.TWO} className="Card">
                    <h5>{volume.name}</h5>
                    <div className="CardContentContainer">
                        <div className="CardContent">
                            <ul className={Classes.LIST_UNSTYLED}>
                                <li>VolumeType: {volume.volumeType}</li>
                                <li>State: {volume.state}</li>
                                <li>{attachments}</li>
                            </ul>
                        </div>
                        <div className="CardContent CardContentRight">
                            <Icon icon={IconNames.DOCUMENT} iconSize={Icon.SIZE_LARGE}/>
                        </div>
                    </div>
                </Card>
            );
        });

        if (cardItems.length > 0) {
            const time = new Date().getTime();
            return (<div key={`volume_${time}`} className="CardContainer">{cardItems}</div>);
        }

        return (<EmptySummary/>);
    }

    public id: TStringOrNumber;
    public label: string;
    public countSummary: any;
    public type: any;

    constructor(){
        this.id = 4;
        this.countSummary = {};
        this.type = NodeClass.VOLUME;
    }

    public async getChildNodes(node: ITopologyNode): Promise<Array<AxiosResponse<any[]>>> {
        return await Promise.all([axios.post(`/volume/${node.id}/metrics`)]);
    }

    public async getSummaryData(node: ITopologyNode, params: any): Promise<Array<AxiosResponse<any[]>>> {
        return await Promise.all([axios.post(`/volume/${node.id}/metrics`, {inputDTO: params})]);
    }

    public createNodeCountElement(node: ITopologyNode): JSX.Element {
        return (<div/>);
    }

    public createNodeSummaryElement(node: ITopologyNode, metrics: any[], filterStr: string): JSX.Element {
        return (<TopologyItemMetrics node={node} metrics={metrics}/>);
    }

    public getIcon(node: ITopologyNode): TIconNameOrJSX {
        return IconNames.DOCUMENT;
    }

    public isExpandable(node: ITopologyNode): boolean {
       return false;
    }
}
