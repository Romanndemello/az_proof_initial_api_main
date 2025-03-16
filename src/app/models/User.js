import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import SHA256 from '@pozible/meteor-sha';

const UsersSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true
        },
        profile: {
            type: Object,
            type: { type: String },
            name: { type: String, required: true },
            secondary_name: { type: String },
            cpf_cnpj: { type: String },
            phone: { type: String },
            status: { type: String },
            roles: {
                type: Array,
                role: { type: String }
            },
            active: {
                type: Boolean
            }
        },
        emails: {
            type: Array,
            required: true,
            address: {
                type: String,
                required: true,
                lowercase: true
            },
            verified: {
                type: Boolean,
                required: true
            }
        },
        services: {
            type: Object,
            required: true,
            password: {
                type: Object,
                required: true,
                bcrypt: {
                    type: String,
                    required: true,
                    select: false
                }
            }
        },
        history: {
            type: Array,
            type: { type: String },
            date: { type: Date }
        },
        removed: {
            type: Boolean
        }
    },
    {
        timestamps: true
    }
);

//Arrow functions não tem acesso ao metodo this
UsersSchema.pre('save', async function (next) {
    //convert  text password to SHA256 to work in Meteor
    const newPassword = SHA256(this.services.password.bcrypt);
    const hash = await bcrypt.hash(newPassword, 10);

    this.services.password.bcrypt = hash;

    next();
});

export default mongoose.model('User', UsersSchema);
