import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageHeader, PageHeaderTitle, Pagination, Section } from '@red-hat-insights/insights-frontend-components';
import {
    filterProviders,
    loadEntities,
    loadSourceTypes,
    setProviderFilterColumn
} from '../redux/actions/providers';
import { Button } from '@patternfly/react-core';
import { Card, CardBody, CardFooter, CardHeader } from '@patternfly/react-core';
import filter from 'lodash/filter';

import SourcesSimpleView from '../components/SourcesSimpleView';
import SourcesFilter from '../components/SourcesFilter';
import SourcesEmptyState from '../components/SourcesEmptyState';
import SourceEditModal from '../components/SourceEditModal';
import { sourcesViewDefinition } from '../views/sourcesViewDefinition';
import { pageAndSize } from '../redux/actions/providers';
import { paths } from '../Routes';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class SourcesPage extends Component {
    static propTypes = {
        filterProviders: PropTypes.func.isRequired,
        setProviderFilterColumn: PropTypes.func.isRequired,
        loadEntities: PropTypes.func.isRequired,
        loadSourceTypes: PropTypes.func.isRequired,
        pageAndSize: PropTypes.func.isRequired,

        filterValue: PropTypes.string,
        loaded: PropTypes.bool.isRequired,
        numberOfEntities: PropTypes.number.isRequired, // total number of Sources

        location: PropTypes.any.isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.any.isRequired
    };

    componentDidMount = () => {
        this.props.loadSourceTypes();
        this.props.loadEntities();
    }

    constructor (props) {
        super(props);

        this.state = {
            itemsPerPage: 10,
            onPage: 1
        };
    }

    onFilter = (filterValue) => {
        console.log('onFilter', filterValue);
        this.props.filterProviders(filterValue);
    }

    onFilterSelect = (_component, column) => {
        console.log('onFilter', column);
        this.props.setProviderFilterColumn(column.value);
    }

    onSetPage = (number) => {
        this.setState({
            onPage: number
        });
        this.props.pageAndSize(number, this.state.itemsPerPage);
    }

    onPerPageSelect = (count) => {
        this.setState({
            onPage: 1,
            itemsPerPage: count
        });
        this.props.pageAndSize(1, count);
    }

    renderMainContent = () => (
        <Card>
            <CardHeader>
                <SourcesFilter
                    columns={filter(sourcesViewDefinition.columns, c => c.searchable)}
                    onFilter={this.onFilter}
                    onFilterSelect={this.onFilterSelect}/>
            </CardHeader>
            <CardBody>
                <SourcesSimpleView columns={sourcesViewDefinition.columns}/>
            </CardBody>
            <CardFooter>
                <Pagination
                    itemsPerPage={this.state.itemsPerPage}
                    page={this.state.onPage}
                    direction='up'
                    onSetPage={this.onSetPage}
                    onPerPageSelect={this.onPerPageSelect}
                    numberOfItems={this.props.numberOfEntities || 0}
                />
            </CardFooter>
        </Card>
    );

    render = () => {
        const { numberOfEntities } = this.props;
        const displayEmptyState = this.props.loaded &&      // already loaded
            !this.props.filterValue &&                      // no filter active
            (!numberOfEntities || numberOfEntities === 0);  // no records do display

        const editorNew = this.props.location.pathname === paths.sourcesNew;
        const editorEdit = this.props.match.path === paths.sourcesEdit;

        return (
            <React.Fragment>
                { editorNew || editorEdit ? <SourceEditModal /> : '' }
                <PageHeader>
                    <PageHeaderTitle title='Sources'/>
                    <Link to={paths.sourcesNew}>
                        <Button className='pull-right' variant='secondary'> Add a New Source </Button>
                    </Link>
                </PageHeader>
                <Section type='content'>
                    {displayEmptyState ? <SourcesEmptyState /> : this.renderMainContent()}
                </Section>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(
    { filterProviders, loadEntities, loadSourceTypes, pageAndSize, setProviderFilterColumn }, dispatch);

const mapStateToProps = ({ providers: { filterValue, loaded, numberOfEntities } }) => (
    { filterValue, loaded, numberOfEntities }
);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SourcesPage));
