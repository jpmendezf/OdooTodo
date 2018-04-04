import React from 'react'

import {
    Body,
    Button,
    Card,
    Container,
    Content,
    Footer,
    FooterTab,
    Form,
    Header,
    H1,
    H2,
    H3,
    Input,
    Item,
    Label,
    Left,
    List,
    ListItem,
    Right,
    Segment,
    Text,
    Title } from 'native-base';

import HTML from 'react-native-render-html';

import {
    Col,
    Row,
    Grid } from 'react-native-easy-grid';

import TaskTimer from '../Components/TaskTimer'
import TaskList from '../Components/TaskList'
import TimesheetList from '../Components/TimesheetList'
import TaskForm from '../Components/TaskForm'

import { connect } from 'react-redux'

import TasksActions, {
    getSelectedTask,
    getSelectedTaskChilds } from '../Redux/TasksRedux'

import { selectTaskTimesheets } from '../Redux/TimesheetsRedux'

import styles from './Styles/HomeScreenStyle'
import { Colors } from '../Themes/'

import EntypoIcon from 'react-native-vector-icons/Entypo'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import I18n from '../I18n';

class TaskScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSegment: 'details',
            startTime: null,
            curTime: 0
        };
    }

    _onPressBack = () => {
         this.props.navigation.goBack();
    }

    _onPressStart = () => {
        console.tron.log(this.props)
        this.props.createTimesheet2('name', curTime, 0, task.id, 8)
        this.setState({
            startTime : new Date()
        })
        this.taskTimer = setInterval( () => {

            this.setState({
//                curTime : new Date() - state.startTime
                curTime : new Date() - this.state.startTime,
                txtTime : this.msToTime( this.state.curTime )
            })
        }, 1000)
    }

    _onPressStop = () => {



        clearInterval(this.taskTimer)
    }

    handleSelectTask = (item) => {
        this.props.setSelectedTask(item)
        this.props.navigation.navigate('TaskScreen')
    }

    render () {
        const { fullname,
                setSelectedTask,
                task,
                timesheets,
                childTasks
            } = this.props

        const { navigate } = this.props.navigation

        return (
            <Container>
                <Header>
                    <Left style={styles.headerLeft}>
                        <MCIcon
                            name="menu"
                            color={Colors.btnText}
                            size={30}
                            style={styles.buttonIconStyle}
                            onPress={() => {
                                navigate('DrawerToggle')
                            }}/>
                    </Left>
                    <Body style={styles.headerBody}>
                        <Title>{task.project_id[1]} - {task.name}</Title>
                    </Body>
                    <Right style={styles.headerRight}>
                        <EntypoIcon
                            name="add-to-list"
                            color={Colors.btnText}
                            size={30}
                            style={styles.buttonIconStyle}
                        />
                    </Right>
                </Header>
                <Segment>
                    <Button
                        active={this.state.activeSegment === 'details'}
                        onPress={() => this.setState({ activeSegment: 'details' })}
                        first
                        >
                        <Text>{I18n.t('details')}</Text>
                    </Button>
                    <Button
                        active={this.state.activeSegment === 'evolution'}
                        onPress={() => this.setState({ activeSegment: 'evolution' })}
                        >
                        <Text>{I18n.t('evolution')}</Text>
                    </Button>
                    <Button
                        active={this.state.activeSegment === 'notes'}
                        onPress={() => this.setState({ activeSegment: 'notes' })}
                        last>
                        <Text>{I18n.t('notes')}</Text>
                    </Button>
                </Segment>
                <Content>
                    { this.state.activeSegment === 'details' &&
                        <TaskForm task={task} />
                    }
                    { this.state.activeSegment === 'evolution' &&
                        <Grid style={{padding:10}}>
                            <Row style={{flex:0, paddingHorizontal:10}}>
                                <H1>{I18n.t('timesheets')}</H1>
                            </Row>
                            <Row style={{flex:1}}>
                                <TimesheetList
                                    timesheets={timesheets}
                                />
                            </Row>
                            <Row style={{flex:0, paddingTop: 10, paddingHorizontal:10}}>
                                <H1>{I18n.t('subtasks')}</H1>
                            </Row>
                            <Row style={{flex:1}}>
                                <TaskList
                                    userTasks={childTasks}
                                    onTaskSelect={this.handleSelectTask}
                                />
                            </Row>
                        </Grid>                    }
                    {/* { this.state.activeSegment === 'notes' &&

                    } */}
                </Content>
                <Footer>
                    <FooterTab>
                        <TaskTimer />
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    const { sessionId } = state.login
    console.tron.log(state)
    return {
        task: getSelectedTask(state),
        childTasks: getSelectedTaskChilds(state),
        timesheets: selectTaskTimesheets(state),
        sessionId: sessionId,
//        username: state.login.
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedTask: (task) => dispatch(TasksActions.setSelectedTask(task)),
        logout: () => dispatch(LoginActions.logout()),
        getTasks: (sessionId) => dispatch(TasksActions.tasksRequest(sessionId)),
        getUsers: (sessionId) => dispatch(UsersActions.usersRequest(sessionId)),
        getProjects: (sessionId) => dispatch(ProjectsActions.projectsRequest(sessionId)),
        createTimesheet: (name, date, unit_amount, task_id, user_id) =>
            dispatch(TimesheetsActions.timesheetsAdd(name, date, unit_amount, task_id, user_id)),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskScreen)