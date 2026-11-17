"use strict";
/** Server-only, deterministic decision support for fictional NPC factions. No external AI service needed. */
const PERSONALITIES = Object.freeze({
  cautious: {label:"Cautious Diplomat", intent:"Protects workers, legitimacy and stable partnerships."},
  profiteer: {label:"Aggressive Profiteer",intent:"Pursues cash flow and market dominance, but can overextend."},
  adaptive: {label:"Adaptive Opportunist",intent:"Rebalances ambition and diplomacy as rivals gain or lose ground."}
});
const AI_NAMES = ["Aegis Syndicate", "Helios Reconstruction", "Meridian Commerce", "Atlas Strategic Holdings"];
const LIMIT = (n,a,b)=>Math.max(a,Math.min(b,n));
const metrics = t=>t.stats || t;
function power(t){const s=metrics(t);return s.capital*7.5+s.workforce*.09+s.influence*3.3+s.stability*3.5+s.intel*2.1+s.morale*.18;}
function climate(room, team){
 const humans=room.teams.filter(t=>!t.isAI);
 const baseline=humans.length?humans.reduce((n,t)=>n+power(t),0)/humans.length:power(team);
 const self=power(team);
 const gap=(baseline-self)/Math.max(25,self);
 const struggling=humans.some(t=>t.strike || t.crisis || t.stats.morale<39 || t.stats.stability<=2);
 return {gap,humansAhead:gap>.08,humansStruggling:struggling||gap<-.12,pressure:LIMIT(gap*2,-1,1)};
}
function valuesFor(personality,team,context){
 const s=metrics(team);
 const base={capital:6.3,workforce:.115,influence:3.0,stability:3.8,intel:2.8,morale:.21};
 if(personality==="cautious")Object.assign(base,{capital:4.2,workforce:.15,influence:3.2,stability:6.1,intel:2.5,morale:.43});
 if(personality==="profiteer")Object.assign(base,{capital:11.4,workforce:.105,influence:4.4,stability:1.7,intel:1.9,morale:.055});
 if(personality==="adaptive")Object.assign(base,{capital:6.8,workforce:.13,influence:3.4,stability:4.1,intel:3.0,morale:.25});
 // An AI with a deteriorating workforce changes its priorities before production stops.
 if(s.morale<52){base.morale+=s.morale<35?.9:.45;base.workforce+=.11;base.capital*=.72;}
 if(s.stability<=3){base.stability+=personality==="profiteer"?.65:4.4;base.capital*=personality==="profiteer"?1.2:.8;}
 if(team.strike){base.morale+=1.2;base.workforce+=.12;}
 // Dynamic difficulty: leaders motivate stronger economic play; struggling players induce restraint.
 if(context.humansAhead){base.capital*=1+.2*context.pressure;base.influence*=1+.3*context.pressure;}
 if(context.humansStruggling){base.stability*=1.28;base.morale*=1.37;if(personality!=="profiteer")base.capital*=.78;}
 if(personality==="adaptive" && context.humansAhead){base.intel*=1.15;base.workforce*=1.15;}
 return base;
}
function canAfford(team, option){const d=option.delta||{},s=metrics(team);return ["capital","influence","intel"].every(k=>(d[k]||0)>=0 || (s[k]||0)+1e-8>=-(d[k]||0));}
function optionUtility(team,option,weights,roundIndex){
 const d=option.delta||{},s=metrics(team);let score=0;
 for(const [k,w] of Object.entries(weights)){
  const now=s[k]||0, max=k==="capital"?99:k==="workforce"?500:k==="morale"?100:10;
  const after=LIMIT(now+(d[k]||0),0,max);
  score+=(after-now)*w;
 }
 // Avoid choices that invite strikes/sanctions even if the immediate cash appears attractive.
 const endMorale=s.morale+(d.morale||0);
 if(endMorale<35)score-=(team.personality==="profiteer"?3:14);
 if(s.stability+(d.stability||0)<=2)score-=(team.personality==="profiteer"?2:12);
 if((roundIndex===2||roundIndex===4)&&option===null)score-=9;
 if(roundIndex===4&&/inclusive|monitored|verified|oversight|compact|community/i.test(option.title))score+=.9;
 return score;
}
function decide(room,team,scenario){
 const context=climate(room,team),weights=valuesFor(team.personality||room.aiPersonality||"adaptive",team,context);
 const ranking=scenario.options.map((o,i)=>({index:i,score:canAfford(team,o)?optionUtility(team,o,weights,room.currentIdx):-Infinity})).sort((a,b)=>b.score-a.score||a.index-b.index);
 return {optionIndex:Number.isFinite(ranking[0]?.score)?ranking[0].index:0,context,reason:context.humansAhead?"increased competitive pressure":context.humansStruggling?"measured, partnership-oriented response":"balanced market analysis"};
}
function settlement(team){const s=metrics(team);if(!team.strike&&s.morale>=43)return null;
 if(s.morale<40&&s.capital>=.35)return {method:"wages",delta:{capital:-.35,morale:28,stability:1}};
 if(s.morale<40&&s.influence>=2)return {method:"mediation",delta:{influence:-2,morale:20,stability:2}};
 return null;
}
function chooseDiplomacy(room,team){
 if(room.currentIdx!==3||room.teams.length<2)return null;
 const targets=room.teams.filter(t=>t!==team && !t.isAI).sort((a,b)=>a.index-b.index);
 if(!targets.length)return null;
 const c=climate(room,team),p=team.personality||"adaptive",s=team.stats;
 const good=targets.find(t=>t.stats.morale<s.morale-12 && t.stats.workforce>=18);
 if(p==="profiteer"&&good&&s.capital>=.45)return {target:good.index,kind:"poach"};
 if(p==="adaptive"&&c.humansAhead&&good&&s.capital>=.45&&s.morale>55)return {target:good.index,kind:"poach"};
 const target=targets.find(t=>t.strike||t.crisis)||targets[0];
 const kind=(p==="cautious"||c.humansStruggling||s.stability<4)?"alliance":s.capital>=.40?"trade":"alliance";
 return {target:target.index,kind};
}
function acceptOffer(room, team, offer){
 const sender=room.teams[offer.from];if(!sender)return false;
 const p=team.personality||"adaptive",s=team.stats,c=climate(room,team);
 if(offer.kind==="trade")return sender.stats.capital>=.40&&(p!=="profiteer"||s.stability<=5||c.humansStruggling);
 if(offer.kind==="alliance")return sender.stats.capital>=.18&&s.capital>=.18&&(p!=="profiteer"||s.morale<58||c.humansStruggling||s.stability<5);
 return false;
}
function defendPoach(room,team,offer){
 const source=room.teams[offer.from];const s=team.stats;if(s.capital<.18)return false;
 return team.personality==="cautious"||s.morale<50||!!(source&&source.stats.morale>s.morale+12);
}
module.exports={PERSONALITIES,AI_NAMES,power,climate,valuesFor,canAfford,decide,settlement,chooseDiplomacy,acceptOffer,defendPoach};
