import * as nodeoutlook from 'nodejs-nodemailer-outlook';
import { createRequire } from 'node:module';

const config = createRequire(import.meta.url)("../config.json");

//fonction pour l'envoi d'email
export function sendtoMail(mail,name){
    nodeoutlook.sendEmail({
        auth: {
            //email relié au site
            user: config.email.email,
            pass: config.email.password,
        },
        from: 'no-reply.upchess23@outlook.com',
        to: mail,
        replyTo: 'no-reply.upchess23@outlook.com',
        subject: 'Bienvenue sur UPChess',
        html: '<div style="text-align: center;"><b>Salut  </b>'+name+'<b>,</b>'+
            '<p>On te souhaite la bienvenue sur UPChess,</p>'+
            '<p>Nous te confirmons ton inscription sur notre site web.</p>' +
            '<p>Tu peux dès à présent te lancer dans ta carrière de champion(ne) de jeu d\'échecs en ligne.</p>'+
            '<p>Amuses-toi bien !</p>'+
            '<br><p>Cordialement,</p>' +
            '<p>L\'équipe de UPChess.</p>'+
            '<img src="https://cdn.discordapp.com/attachments/694648081681219664/1098257604137996350/logo.png" alt="Logo" height="96px" width="120px"></div>',


        //message d'erreur
        onError: (e) => { console.erreur("Erreur lors de l'envoi de l'email:", e); },
        //message de validation
        onSuccess: (i) => { console.log("Email envoyé avec succès:");}
    });
}
