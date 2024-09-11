<template>
    <!-- 注册 -->
    <div class="register">
        <div class="form-box">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                <el-form-item label="邮箱" prop="email">
                    <el-input placeholder="请输入邮箱" v-model="ruleForm.email"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" placeholder="请再次输入密码" v-model="ruleForm.checkPass"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model.number="ruleForm.age" placeholder="请输入年龄"></el-input>
                </el-form-item>

                <el-form-item label="验证码" prop="validCode">
                    <div class="validcode-box">
                        <div class="validcode-ipt">
                            <el-input type="text" v-model="ruleForm.validCode" autocomplete="off" placeholder="请输入验证码"
                                maxlength="6"></el-input>
                        </div>
                        <div>
                            <!-- <el-button type="primary" :disabled="isSend" @click="sendValidCode">{{ text }}</el-button> -->
                            <div class="validcode-img">
                                <img :src="imgSvg" alt="ssss" srcset="" title="看不清楚，点击刷新验证码" @click="sendValidCode">
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="register('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
  
  
<script>
import { sendValidCode, register } from "@/apis/user";

export default {
    name: "register",
    data() {
        var checkAge = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("年龄不能为空"));
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error("请输入数字值"));
                } else {
                    if (value < 18) {
                        callback(new Error("必须年满18岁"));
                    } else {
                        callback();
                    }
                }
            }, 1000);
        };
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.ruleForm.checkPass !== "") {
                    this.$refs.ruleForm.validateField("checkPass");
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForm.pass) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        var validateEmail = (rule, value, callback) => {
            let email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (value === "") {
                callback(new Error("请输入邮箱地址"));
            } else if (!email.test(value)) {
                callback(new Error("请输入正确的邮箱地址"));
            } else {
                callback();
            }
        };
        //验证验证码
        let validateValidCode = (rule, value, callback) => {
            let validCodeReg = /^[A-Za-z0-9]{6}$/;

            if (value === "") {
                callback(new Error("请输入验证码"));
            } else if (!validCodeReg.test(value)) {
                callback(new Error("验证码支持数字字母组合，6位"));
            } else {
                callback();
            }
        };
        return {
            isLogin: false, //是否切换为登录
            // isLogin: true, //是否切换为注册
            imgSvg: null,

            ruleForm: {
                pass: "",
                checkPass: "",
                age: "",
                email: "",
                validCode: "",
            },

            rules: {
                pass: [{ required: true, validator: validatePass, trigger: "blur" }],
                checkPass: [{ required: true, validator: validatePass2, trigger: "blur" }],
                age: [{ required: true, message: '年龄不能为空', trigger: 'blur' },
                {
                    pattern: /^(\d+)$|^(\d+\.\d+)$/,
                    message: "载重格式为数字",
                    trigger: "blur",
                }
                ],
                email: [{ required: true, validator: validateEmail, trigger: ["blur", "change"] }],
                validCode: [{ required: true, validator: validateValidCode, trigger: "blur" }],
            },

            Login: {
                email: "123@qq.com",
                password: "123",
            },
            loginRules: {
                email: [{ validator: validateEmail, trigger: "blur" }],
                password: [{ validator: validatePass, trigger: "blur" }],
            },
            isSend: false,
            text: "发送验证码",
            validCodeId: "",
        };
    },
    created() {
        this.sendValidCode();
    },
    methods: {
        //注册
        register(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        email: this.ruleForm.email,
                        password: this.ruleForm.pass,
                        age: this.ruleForm.age,
                        validCodeId: this.validCodeId,
                        validCode: this.ruleForm.validCode,
                    }
                    register(data).then((result) => {
                        this.$emit('register');
                    })

                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        //重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //发送验证码
        sendValidCode() {
            sendValidCode().then((result) => {
                this.validCodeId = result.data.result.validCodeId;
                this.imgSvg = result.data.result.img;
            })

        },
    },
};
</script>
  
<style lang="less" scoped>
.register {
    width: 500px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px 0;

    .form-box {
        width: 80%;
        margin: 0 auto;

    }

    /deep/ .el-form-item__label {
        // color: #fff;
    }

    .validcode-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        //.validcode-img {
        //  height: 40px;
        //        }
    }
}
</style>