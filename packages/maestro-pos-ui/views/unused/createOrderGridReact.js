/*
injectTapEventPlugin();

var {
    Styles,
    GridList,
    GridTile,
    IconButton,
    FontIcon,
    Card,
    CardHeader,
    Toolbar,
    ToolbarGroup,
    DropDownMenu,
    ToolbarSeparator,
    DropDownIcon,
    RaisedButton,
    CardMedia,
    CardTitle,
    CardActions,
    FlatButton,
    CardText,
    ToolbarTitle,
    Avatar
    } = MUI;

var { ThemeManager, LightRawTheme } = Styles;

//console.log("grid list: ", MUI );

ProductsGrid = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        return {
            products: Products.find().fetch()
        };
    },
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },
    getChildContext() {
        return {
            muiTheme: ThemeManager.getMuiTheme(LightRawTheme)
        };
    },
    render: function () {
        let filterOptions = [
            { payload: '1', text: 'All Broadcasts' },
            { payload: '2', text: 'All Voice' },
            { payload: '3', text: 'All Text' },
            { payload: '4', text: 'Complete Voice' },
            { payload: '5', text: 'Complete Text' },
            { payload: '6', text: 'Active Voice' },
            { payload: '7', text: 'Active Text' },
        ];
        let iconMenuItems = [
            { payload: '1', text: 'Download' },
            { payload: '2', text: 'More Info' }
        ];

        return <div>
                    <Toolbar>
                        <ToolbarGroup key={0} float="left">
                            <DropDownMenu menuItems={filterOptions} />
                        </ToolbarGroup>
                        <ToolbarGroup key={1} float="right">
                            <ToolbarTitle text="Options" />
                            <FontIcon className="mui-icon-sort" />
                            <DropDownIcon iconClassName="icon-navigation-expand-more" menuItems={iconMenuItems} />
                            <ToolbarSeparator/>
                            <RaisedButton label="Create Broadcast" primary={true} />
                        </ToolbarGroup>
                    </Toolbar>
                    <div>
                        <GridList
                            cols={5}
                            cellHeight={200}
                            padding={1}
                            style={{flex: 1, height: 450, overflowY: 'auto'}}
                            >
                            {
                            this.data.products.map(product =>
                                    <GridTile
                                        key={product._id}
                                        title={product.name}
                                        titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"

                                        actionIcon={<IconButton><FontIcon className="material-icons">home</FontIcon></IconButton>}>
                                        <img src="/flower.jpeg" />
                                    </GridTile>
                                )
                            }
                        </GridList>

                        <Card style={{flex: 1}}>
                            <CardHeader
                                title="Title"
                                subtitle="Subtitle"
                                avatar={<Avatar>A</Avatar>}/>
                            <CardHeader
                                title="Demo Url Based Avatar"
                                subtitle="Subtitle"
                                avatar="/flower.jpeg"/>
                            <CardMedia overlay={<CardTitle title="Title" subtitle="Subtitle"/>}>
                                <img src="/flower.jpeg"/>
                            </CardMedia>
                            <CardTitle title="Title" subtitle="Subtitle"/>
                            <CardActions>
                                <FlatButton label="Action1"/>
                                <FlatButton label="Action2"/>
                            </CardActions>
                            <CardText>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                                Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                                Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                            </CardText>
                        </Card>
                    </div>
                </div>;
    }
});

*/
