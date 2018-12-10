import React, { Component } from 'react';
import Table from '../../organisms/js/table';

class TimesheetView extends Component {
    constructor(props) {
        super(props);
        this.prop = this.props && this.props.prop ? this.props.prop : {}
    }
    componentWillReceiveProps(new_props) {
        this.prop = new_props && new_props.prop ? new_props.prop : {}
    }
    render() {
        let prop_data = this.prop || {};
        return (
            <div className = "table_template">
                <Table prop = {prop_data} />
            </div>
        )
    }
}

export default TimesheetView;