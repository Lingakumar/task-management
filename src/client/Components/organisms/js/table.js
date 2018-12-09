import React, { Component } from 'react';

class Table extends Component {
    constructor(props) {
        super(props);
        this.prop = this.props && this.props.prop ? this.props.prop : {}
    }
    componentWillReceiveProps(new_props) {
        if(new_props && new_props.prop) {
            if(new_props.prop.head) {
                this.prop.head = new_props.prop.head;
            }
            if(new_props.prop.body) {
                this.prop.body = new_props.prop.body;
            }
        }
    }
    render() {
        let prop_data = this.prop || {};
        return (
            <table className = "cls_table">
                {prop_data.head ? <TableHead data = {prop_data.head} /> : ""}
                {prop_data.body ? <TableBody data = {prop_data.body} /> : ""}
                {prop_data.footer ? <TableFooter data = {prop_data.footer} /> : ""}
            </table>
        )
    }
}

const TableHead = (data) => {
    let head_data = data  && data.data ? data.data : [];
    return (
        <thead>
            {
                head_data ? head_data.map((row_data, key) => {
                    return <TableRow data = {row_data} key = {key} header = {true}/>
                }) : ""
            }
        </thead>
    )
}

const TableBody = (data) => {
    let body_data = data  && data.data ? data.data : [];
    return (
        <tbody>
            {
                body_data ? body_data.map((row_data, key) => {
                    return <TableRow data = {row_data} key = {key} header = {false} />
                }) : ""
            }
        </tbody>
    )
}

const TableFooter = (data) => {
    let footer_data = data  && data.data ? data.data : [];
    return (
        <tfoot valign = "bottom">
            {
                footer_data ? footer_data.map((row_data, key) => {
                    return <TableRow data = {row_data} key = {key} header = {false}/>
                }) : ""
            }
        </tfoot>
    )
}

const TableRow = (data, key) => {
    let row_data = data  && data.data ? data.data : [];
    return (
        <tr key = {key}>
            {
                row_data ? row_data.map((element, key) => {
                    return <TableElement value = {element} key = {key} isFromHeader = {data.header} />
                }) : ""
            }
        </tr>
    )
}

const TableElement = (value) => {
    return (
        value.isFromHeader ? 
        (
            <th>
                <div className = "header_element">{value.value}</div>
            </th> 
        ) : 
        ( 
            <td>
                <div className = "row_element">{value.value}</div>
            </td>
        )
    )
}

export default Table;