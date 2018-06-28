import {Icon, Tooltip} from "@blueprintjs/core";
import * as React from 'react';
import {TIconNameOrJSX} from "../../typings/lang";

interface ITooltipIconProps {
    isEmpty: boolean;
    identifier: string;
    tooltipContent: string;
    text: string;
    icon: TIconNameOrJSX;
    iconColor: string;
    iconSize: number;
    iconStyle: any;
}

export class TooltipIcon extends React.Component<ITooltipIconProps, any> {

    public render() {
        const isEmpty: boolean = this.props.isEmpty;
        const identifier: string = this.props.identifier;
        const tooltipContent: string = this.props.tooltipContent;
        const text: string = this.props.text;
        const icon: TIconNameOrJSX = this.props.icon;
        const iconColor: string = this.props.iconColor;
        const iconSize: number = this.props.iconSize;
        const iconStyle: any =  this.props.iconStyle;

        if (isEmpty) {
            return (<span/>);
        }

        const fontSize = {fontSize: `8px`};
        return (
            <Tooltip key={identifier} content={tooltipContent} className='Tooltip'>
                <span style={fontSize}>
                    {text}
                    <Icon color={iconColor}
                          icon={icon}
                          iconSize={iconSize}
                          style={iconStyle}/>
                </span>
        </Tooltip>);
    }
}
