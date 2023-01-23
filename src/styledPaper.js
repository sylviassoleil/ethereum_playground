import React from "react";
// import PropTypes from "prop-types";
// import { withStyles } from "@material-ui/core/styles";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import blue from "@material-ui/core/colors/blue";

const useStyles = makeStyles((theme) => ({
    root: (props) => ({
        padding: theme.spacing(1),
        height: "100%",
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        // borderRadius: 16,
        // borderTopWidth: 2,
        borderTopColor: blue[900],
        borderTopStyle: "solid",
        overflowY: "auto",
        backgroundColor: "#EBECF0",
        ...props,
    }),
}));

export default function StyledPaper(props) {
    const classes = useStyles(props.styles);
    return <Paper className={classes.root}>{props.children}</Paper>;
}
