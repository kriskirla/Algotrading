import React from "react";
import { LinearProgress, FormHelperText } from '@material-ui/core';

const LinearLoading = ({info}) => {
    return (
        <FormHelperText>
            <LinearProgress />
            <div align="center">
                {info}
            </div>
        </FormHelperText>
    );
}

export default LinearLoading;