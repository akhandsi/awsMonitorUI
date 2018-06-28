import {Intent, Tag} from "@blueprintjs/core";
import * as React from 'react';
import {TFunction} from "../../typings/lang";

interface IFilterTagListProps {
    tags: string[];
    onSelectTag: TFunction<string, void>;
}

interface IFilterTagListState {
    selectedTag: string;
}

export class FilterTagList extends React.Component<IFilterTagListProps, IFilterTagListState> {

    public state: IFilterTagListState;

    private readonly TagStyle = {'margin': '4px'};

    constructor(props: IFilterTagListProps) {
        super(props);
        this.state = {
            selectedTag: 'all',
        };
    }

    public render() {

        const tagElements = (this.props.tags || []).map((tag: any) => {
            return (
                <Tag key={tag}
                     interactive={true}
                     onClick={this.onSelectTag}
                     intent={tag === this.state.selectedTag ? Intent.SUCCESS: Intent.NONE}
                     round={true}
                     style={this.TagStyle}>
                    {tag}
                </Tag>
            );
        });

        return (<div>{tagElements}</div>);
    }

    private onSelectTag = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (event.target) {
            const selectedTag = (event.target as HTMLDivElement).innerText;
            this.setState({selectedTag});
            return this.props.onSelectTag(selectedTag);
        }
    };
}
