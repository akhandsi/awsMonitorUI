import {Classes, Tree} from "@blueprintjs/core";
import axios, {AxiosResponse} from 'axios';
import * as React from 'react';
import {ITopologyNode, ITreeItemSet} from "../../models/model";
import {TopologyConfiguration} from "../TopologyItem/TopologyConfiguration";
import {TopologyItemDetails} from "../TopologyItem/TopologyItemDetails";
import './Topology.css';

interface ITreeState {
    nodes: ITopologyNode[];
    selectedNode?: ITopologyNode | undefined;
}

export class Topology extends React.Component<any, ITreeState> {

    private static async fetchRegions(): Promise<Array<AxiosResponse<any[]>>> {
        return await Promise.all([axios.get('/regions')]);
    }

    public state: ITreeState = {nodes: []};

    private treeConfiguration: ITreeItemSet = TopologyConfiguration.getConfiguration();

    public componentDidMount() {
        this.addTreeNodes(Topology.fetchRegions(), null);
    }

    public render() {
        return (
            <div className="TopologyContainer">
                <div className="TopologyTreeBox">
                    <Tree
                        contents={this.state.nodes}
                        onNodeClick={this.handleNodeClick}
                        onNodeCollapse={this.handleNodeCollapse}
                        onNodeExpand={this.handleNodeExpand}
                        className={Classes.ELEVATION_0}
                    />
                </div>
                <div className="TopologyStatBox">
                    <TopologyItemDetails selectedNode={this.state.selectedNode}/>
                </div>
            </div>
        );
    }

    private addTreeNodes(promise: Promise<Array<AxiosResponse<any[]>>>, nodeData: ITopologyNode | null): void {
        promise
            .then((responses: Array<AxiosResponse<any[]>>) => {
                let flatResponse: any[] = [];

                responses.forEach(response => {
                    flatResponse = flatResponse.concat(...response.data);
                });

                const treeNodes: ITopologyNode[] = flatResponse.map((node: any) => {
                    const treeConfig: ITopologyNode = this.treeConfiguration[node.type];
                    const nodeItem: any = {};
                    nodeItem.id = node._id;
                    nodeItem.label = node.name;
                    nodeItem.type = node.type;
                    nodeItem.countSummary = node.summary || {};
                    nodeItem.nodeData = node;
                    nodeItem.icon = treeConfig.getIcon(nodeItem);
                    nodeItem.hasCaret = treeConfig.isExpandable(nodeItem);

                    if (treeConfig.createNodeCountElement) {
                        nodeItem.secondaryLabel = treeConfig.createNodeCountElement(nodeItem);
                    }
                    return nodeItem;
                });

                if (nodeData) {
                    nodeData.childNodes = treeNodes;
                    return this.setState(this.state);
                }

                this.setState({nodes: treeNodes});
            })
            .catch((e: any) => {

                if (nodeData) {
                    nodeData.childNodes = [];
                    return this.setState(this.state);
                }

                this.setState({nodes: []});
            });
    }

    private handleNodeExpand = (nodeData: ITopologyNode) => {
        const treeConfig: ITopologyNode = this.treeConfiguration[nodeData.type];

        if (!treeConfig) {
            return;
        }

        if (!treeConfig.getChildNodes) {
            return;
        }

        nodeData.isExpanded = true;

        if (nodeData.childNodes && nodeData.childNodes.length > 0) {
            return this.setState(this.state);
        }

        // only add tree nodes if we didn't fetch them earlier
        return this.addTreeNodes(treeConfig.getChildNodes(nodeData), nodeData);
    };

    private handleNodeCollapse = (nodeData: ITopologyNode) => {
        nodeData.isExpanded = false;
        this.setState(this.state);
    };

    private handleNodeClick = (nodeData: ITopologyNode) => {

        this.state.nodes.forEach(this.deselectNode);
        nodeData.isSelected = true;
        this.state.selectedNode = nodeData;

        this.setState(this.state);
    };

    private deselectNode = (node: ITopologyNode) => {
        node.isSelected = false;

        if (node.childNodes && node.childNodes.length > 0) {
            node.childNodes.forEach(this.deselectNode);
        }

        return node;
    };
}
