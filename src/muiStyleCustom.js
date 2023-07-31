import { makeStyles } from "@material-ui/styles";

const muiStyleCustom = makeStyles(() => ({
    inputLabel: {
        color: "#77797d",
        "&.focused": {
            color: "red"
        }
    }
}));

export default muiStyleCustom;