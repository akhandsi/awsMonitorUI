import {Classes, Tree} from "@blueprintjs/core";
import * as React from 'react';
import {ITopologyNode} from "../../models/model";
import {TFunction} from "../../typings/lang";

interface IRelationalTreeProps {
    handleNodeClick: TFunction<ITopologyNode, any>;
    handleNodeCollapse: TFunction<ITopologyNode, any>;
    handleNodeExpand: TFunction<ITopologyNode, any>;
}

interface IRelationalTreeState {
    nodeList: ITopologyNode[];
    selectedNode?: ITopologyNode | null;
}

export class RelationalTree extends React.Component<IRelationalTreeProps, IRelationalTreeState> {

    public state: IRelationalTreeState = {
        nodeList: [],
        selectedNode: null
    };

    public render() {
        return (
            <Tree
                contents={this.state.nodeList}
                onNodeClick={this.props.handleNodeClick}
                onNodeCollapse={this.props.handleNodeCollapse}
                onNodeExpand={this.props.handleNodeExpand}
                className={Classes.ELEVATION_0}
            />);
    }
}
