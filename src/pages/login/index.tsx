import { useState } from "react";
import { Form, Input, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import usePageInsets from "../../hooks/usePageInsets";
import Brand from "../../components/Brand";
import Button from "../../components/Action";
import "./index.less";

export default function Login() {
  const insets = usePageInsets();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<
    "account" | "password" | "agreement"
  >("account");

  const showInfo = (title: string, content: string) => {
    void Taro.showModal({
      title,
      content,
      showCancel: false,
      confirmColor: "#435bd8",
    });
  };

  const submit = () => {
    setErrorField("account");
    if (!account.trim()) return setError("请输入你的邮箱或手机号");
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.trim()) &&
      !/^1[3-9]\d{9}$/.test(account.trim())
    ) {
      return setError("请输入有效的邮箱或 11 位手机号");
    }
    setErrorField("password");
    if (!password) return setError("请输入密码");
    setErrorField("agreement");
    if (!agreed) return setError("请先阅读并同意用户协议和隐私政策");
    setError("");
    showInfo(
      "登录服务待接入",
      "页面与表单校验已就绪，接入登录接口后即可进入工作台。当前不会发送或保存你的账号密码。",
    );
  };

  // const goHome = () => {
  //   if (Taro.getCurrentPages().length > 1) {
  //     void Taro.navigateBack();
  //   } else {
  //     void Taro.reLaunch({ url: "/pages/index/index" });
  //   }
  // };

  return (
    <View className='auth-page' style={insets.page}>
      <View className='auth-shell'>
        <View className='auth-nav' style={insets.header}>
          {/* <Button
            className="auth-button auth-back"
            ariaLabel="返回首页"
            onClick={goHome}
          >
            <View className="auth-chevron" />
          </Button>
          <Button
            className="auth-button auth-help"
            onClick={() =>
              showInfo(
                "需要帮助？",
                "如需开通账号或重置密码，请联系你所在团队的管理员。",
              )
            }
          >
            需要帮助？
          </Button> */}
        </View>

        <View className='auth-content'>
          <View className='auth-brand'>
            <Brand />
          </View>
          <View className='auth-workspace-label'>你的调研工作台</View>
          <View className='auth-heading'>登录问序</View>
          <View className='auth-description'>
            创建问卷、收集反馈，发现答案背后的价值。
          </View>

          <Form onSubmit={submit}>
            <View className='auth-field'>
              <Text className='auth-label'>邮箱或手机号</Text>
              <View
                className={`auth-input-wrap ${error && errorField === "account" ? "auth-input-invalid" : ""}`}
              >
                <Input
                  className='auth-input'
                  name='account'
                  ariaLabel='邮箱或手机号'
                  placeholder='输入邮箱或手机号'
                  placeholderClass='auth-placeholder'
                  value={account}
                  maxlength={100}
                  onInput={(event) => {
                    setAccount(event.detail.value);
                    setError("");
                  }}
                />
              </View>
              {error && errorField === "account" && (
                <View className='auth-field-error' role='alert'>
                  {error}
                </View>
              )}
            </View>
            <View className='auth-field'>
              <Text className='auth-label'>密码</Text>
              <View
                className={`auth-input-wrap ${error && errorField === "password" ? "auth-input-invalid" : ""}`}
              >
                <Input
                  className='auth-input'
                  name='password'
                  ariaLabel='密码'
                  placeholder='输入登录密码'
                  placeholderClass='auth-placeholder'
                  password={!visible}
                  value={password}
                  maxlength={128}
                  onInput={(event) => {
                    setPassword(event.detail.value);
                    setError("");
                  }}
                  onConfirm={submit}
                />
                <Button
                  className='auth-button auth-visibility'
                  ariaLabel={visible ? "隐藏密码" : "显示密码"}
                  onClick={() => setVisible(!visible)}
                >
                  <View
                    className={`auth-eye ${visible ? "auth-eye-open" : ""}`}
                  >
                    <View className='auth-eye-pupil' />
                  </View>
                </Button>
              </View>
            </View>
            {error && errorField === "password" && (
              <View className='auth-field-error password-error' role='alert'>
                {error}
              </View>
            )}
            <View className='auth-recovery'>
              <Button
                className='auth-button auth-link'
                onClick={() =>
                  showInfo(
                    "忘记密码",
                    "请联系团队管理员重置密码。自助找回功能将在账号服务接入后开放。",
                  )
                }
              >
                忘记密码？
              </Button>
            </View>
            <Button className='auth-button auth-submit' onClick={submit}>
              登录工作台
              <View className='auth-arrow' />
            </Button>
            <View className='auth-agreement'>
              <Button
                className={`auth-button auth-check ${agreed ? "auth-checked" : ""}`}
                ariaLabel={
                  agreed
                    ? "取消同意用户协议和隐私政策"
                    : "同意用户协议和隐私政策"
                }
                onClick={() => {
                  setAgreed(!agreed);
                  setError("");
                }}
              >
                <View className='auth-check-box'>{agreed ? "✓" : ""}</View>
              </Button>
              <View className='auth-agreement-text'>
                我已阅读并同意
                <Button
                  className='auth-button auth-policy'
                  onClick={() =>
                    showInfo(
                      "用户协议",
                      "用户协议尚未配置，正式开放登录前需提供完整协议。当前页面仅用于设计预览。",
                    )
                  }
                >
                  《用户协议》
                </Button>
                和
                <Button
                  className='auth-button auth-policy'
                  onClick={() =>
                    showInfo(
                      "隐私政策",
                      "隐私政策尚未配置。此预览页面不会发送或保存你的账号密码；正式上线前需提供完整隐私政策。",
                    )
                  }
                >
                  《隐私政策》
                </Button>
              </View>
            </View>
            {error && errorField === "agreement" && (
              <View className='auth-field-error' role='alert'>
                {error}
              </View>
            )}
          </Form>
          <View className='auth-signup'>
            还没有账号？
            <Button
              className='auth-button auth-link'
              onClick={() =>
                showInfo(
                  "加入问序",
                  "请联系团队管理员申请账号。自主注册将在账号服务接入后开放。",
                )
              }
            >
              联系管理员开通<Text className='auth-link-arrow'>↗</Text>
            </Button>
          </View>
        </View>
        <View className='auth-footer'>
          <View className='auth-footer-line' />
          <Text>每一个回答，都值得被看见</Text>
          <Text className='auth-copyright'>
            © {new Date().getFullYear()} Survey Kit
          </Text>
        </View>
      </View>
    </View>
  );
}
