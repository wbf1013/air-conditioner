import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
// import Link from "@material-ui/core/Link"

import ProTip from "../components/ProTip";
import RemoteControl from "../components/RemoteControl";

import AirConditioner from "../features/ac/AirConditioner";
import Toast from "../features/toast/Toast";

import { ThemeProvider } from "../theme";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";

import {
  AcMode,
  acItemKey,
  setTemperature,
  setMode,
  setStatus,
} from "../features/ac/acSlice";
import { useEffect } from "react";

function Home() {
  const ac = useAppSelector((state: RootState) => state.ac);

  const dispatch = useAppDispatch();
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      // 重复设置相同的键值不会触发该事件
      switch (e.key) {
        case acItemKey.status:
          dispatch(setStatus(e.newValue === "true"));
          break;
        case acItemKey.temperature:
          dispatch(setTemperature(parseInt(e.newValue || "20")));
          break;
        case acItemKey.mode:
          dispatch(setMode((e.newValue || "cold") as AcMode));
          break;
        default:
          break;
      }
    }
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, [dispatch]);

  /**
   * 根据模式返回对应的色温
   * @returns
   */
  function getClassByMode() {
    if (ac.status) {
      return ac.mode === "hot" ? "hot-color" : "cold-color";
    } else {
      return "";
    }
  }

  return (
    <ThemeProvider>
      <Container maxWidth="sm" className={getClassByMode()}>
        <Box sx={{ pt: 4 }} bgcolor="transparent">
          <Typography
            color="textPrimary"
            align="center"
            variant="h4"
            component="h1"
            gutterBottom
          >
            便携小空调
          </Typography>
          <ProTip />
          <AirConditioner
            status={ac.status}
            temperature={ac.temperature}
            mode={ac.mode}
          />
          <div className="text-center">
            <Box sx={{mt:2}}>
            <Button variant="outlined" href="https://fan.faxiaosi.com/img/aamic-m8v4o1.jpg" target="_blank">
            🍉
            </Button>
            </Box>
          </div>
          <RemoteControl />
          
        </Box>
        <Toast />
      </Container>
    </ThemeProvider>
  );
}

export default Home;
