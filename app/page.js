'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

/* ─────────────────────────────── DATA ─────────────────────────────── */
const PRICES = { men: 37, anu: 169, fun: 169, m397: 397, m497: 497 }
const MRR_BASE = 654
const ESCENARIOS = { piso: 7400, diez: 10000, base: 11850, meta: 15300 }

const DAYS = [
  { d:"2026-06-12", f:"D0", fl:"DÍA 0 · PRODUCCIÓN", pill:"gray",
    foco:"Hoy no se lanza nada: se deja TODO listo para que mañana solo ejecutes. La rana es cerrar la grabación de los ads y que Marce confirme la campaña Meta.",
    pub:"—", yt:"—", wpp:"—", sto:"—",
    graba:"Ads pendientes (8-10 con energía real). Si da tiempo: el video del sábado ('Cómo progresar más rápido que el 98%').",
    marce:"Campaña Meta armada: 8-10 creativos, $17-25/día, target 18-21, destino = curso gratis '$1,000 en 3 meses'. Lista para disparar mañana.",
    joc:"Verificar que el grupo de WhatsApp esté listo para recibir gente. Descripción del grupo = 'Curso gratuito: cómo ganar tus primeros $1,000 en 3 meses'.",
    checks:["Drive organizado por bloques + links enviados a José y David","Ads grabados → crudos en sus carpetas (BLOQUE_A_JOSE / B_DAVID / C_CHECO)","José edita sus 5 → FINALES_APROBADOS · David edita sus 5 → FINALES_APROBADOS","Confirmar con Marce: mañana se dispara la campaña ✅","Dormir temprano — mañana arranca el maratón"] },

  { d:"2026-06-13", f:"F1", fl:"F1 D1 — ARRANQUE 🚀", pill:"gold",
    foco:"Primer día del lanzamiento. Todo empuja a lo mismo: existe un curso gratis para ganar tus primeros $1,000. El Reel abre la herida (dolor del avatar), el video de YT da el primer golpe de autoridad, las stories cuentan el inicio de tu historia. Energía máxima — este día marca el tono del mes.",
    pub:"Reel: Autoridad #4 🩹 — guion: nombra el dolor ('eres inteligente pero no produces nada'), tú como prueba de que sí es posible, CTA al final: 'Comenta REALIDAD y te mando el acceso al curso gratis'. Pilar Autoridad = el dolor es el setup, TÚ eres el payoff.",
    yt:"'Cómo progresar más rápido que el 98%' — el 1er video del lanzamiento. Descripción con link al grupo de WhatsApp. Este video es el gancho de YouTube para los 40K dormidos.",
    wpp:"Día 1 del PDF: El Espejo de la Realidad. Mandarlo a los 800 existentes + a cada nuevo que entre al grupo hoy.",
    sto:"🟪 Tráfico — Story 1/6: hook vulnerable ('Esto no se lo había dicho a nadie de mi edad…'). Story 2/6: origen del problema (tu yo de antes — el scroll, la dependencia). SIN CTA todavía.",
    graba:"Si no quedó ayer: video YT del sábado. PM: batch del fin de semana ('Adicto al celular' para lun 15 + 'Cuando te interesa todo' para vie 19).",
    marce:"🚀 DISPARAR CAMPAÑA. Verificar que los 8-10 ads corran y el link del grupo funcione. Noche: primer vistazo al CPL — si alguno supera $1.50, marcar en rojo.",
    joc:"Monitorear que los nuevos entren bien al grupo. Si hay problemas técnicos, resolver HOY.",
    checks:["Reel publicado con CTA 'comenta REALIDAD'","Video YT arriba con link al grupo en descripción","Mensaje Día 1 enviado al canal de WPP","Stories 1-2 de la secuencia Tráfico subidas","Campaña Meta corriendo ✅ (Marce confirma)","Repost del Reel a TikTok con link en bio","Leads del día registrados en Stats antes de dormir"] },

  { d:"2026-06-14", f:"F1", fl:"F1 D2 — batch del fin", pill:"gold",
    foco:"Domingo de producción. El contenido del día sale en automático (guion del PDF ya escrito); tu energía real va a GRABAR los videos de YouTube de la semana. La regla de 96 hrs se gana o se pierde HOY — si no grabas el batch, el lunes llegas sin videos.",
    pub:"Reel: Conexión #12 🩹 — identidad rota: 'eres inteligente pero no produces nada'. Pilar Conexión = toca la herida directamente.",
    yt:"— (día de grabación, no de subida)",
    wpp:"Día 2 del PDF: La Identidad Rota. Mandarlo al canal.",
    sto:"🟪 Tráfico — Story 3/6: amplificación del dolor ('cómo empeoró — la deuda, el asco de no aportar'). Story 4/6: el punto de quiebre (la decisión que lo cambió todo).",
    graba:"🎬 BATCH CRÍTICO: 'Adicto al celular' (sube lun 15) + 'Cómo ser exitoso cuando te interesa todo' (sube vie 19). Subirlos a Drive → avisar a David.",
    marce:"Revisar CPL del día 1. ¿Algún ad claramente muerto ya (CPL > $1.50 o 0 clics en 24 hrs)? Anotarlo en Stats → Ads.",
    joc:"—",
    checks:["Reel + repost TikTok","Mensaje Día 2 al canal","Stories 3-4 subidas","🎬 'Adicto al celular' grabado → Drive","🎬 'Cuando te interesa todo' grabado → Drive","Crudos enviados a David (tiene 3 días c/u)","Stats: leads del día capturados"] },

  { d:"2026-06-15", f:"F1", fl:"F1 D3 — modo escuela", pill:"gold",
    foco:"Lunes de exámenes. Bloque 5:30-7:00 AM saca todo el contenido del día. Tarde solo revisas números. Mañana es el CHECKPOINT — hoy en la noche ya quieres saber cuántos leads van acumulados en los días 1-3.",
    pub:"Reel: Conexión #17 🩹 — miedo a la dependencia: 'a los 25 pidiéndole a tus papás'. CTA: link en bio → curso gratis.",
    yt:"'Adicto al celular' (lo editó David — sube hoy, descripción con link al grupo).",
    wpp:"Día 3 del PDF: El Miedo a la Dependencia.",
    sto:"🟪 Tráfico — Story 5/6: aprendizaje ('consumir no es progresar; lo que te falta es estructura, no ganas'). Story 6/6: CTA suave final: 'Armé un curso GRATIS: cómo ganar tus primeros $1,000 en 3 meses. Comenta REALIDAD'.",
    graba:"Entre exámenes: ads 11-15 del batch 2 (bloques de 5, misma setup).",
    marce:"Preparar el form de investigación (5 preguntas: ¿cerraste cliente? ¿cuánto facturaste? ¿qué te frena? ¿seriedad 1-10? ¿capacidad de pago?) — se manda MAÑANA. Contar leads acumulados días 1-3 para el checkpoint.",
    joc:"Recordatorio interno: pasarela del anual $169 — deadline miércoles sin falta.",
    checks:["Reel + repost TikTok","Video YT 'Adicto al celular' arriba","Mensaje Día 3 al canal","Stories 5-6 (primera secuencia Tráfico COMPLETA ✅)","Ads 11-15 grabados (si dio el día)","Stats: leads capturados para el checkpoint de mañana"] },

  { d:"2026-06-16", f:"F1", fl:"F1 D4 — 📍 CHECKPOINT + ARRANCA OPERACIÓN CAJA", pill:"red",
    foco:"El día más cargado de la semana 1. DOS eventos críticos en paralelo: (1) CHECKPOINT — el conteo de leads días 13-15 decide si ajustas la campaña; (2) Marce dispara el FORM a los 800+57 Y el TOQUE 1 a los 39 leads del xlsx. El primer DM del día es para alex 🔥 (el más caliente).",
    pub:"Reel: '3 apps para ganar dinero' 🔥 VIRAL — hook amplio y libre. No se alinea al dolor: su trabajo es alcance frío y traer ojos nuevos al perfil.",
    yt:"—",
    wpp:"Días 4+5 FUSIONADOS del PDF: Caos de Información + Revelación del Vehículo. CTA en el mensaje: 'Comenta HABILIDAD'.",
    sto:"Espejo del día + countdown sticker: 'el curso gratis cierra el jueves a medianoche' — urgencia real para entrar al grupo.",
    graba:"Ads 16-20 del batch 2 si faltan.",
    marce:"📨 FORM a 800 WPP + 57 miembros. TOQUE 1 a Tier 1 y Tier 2 del xlsx (ALEX PRIMERO — ya re-aplicó con bolsillo 250-400). Primer contacto a los 4 nuevos 🅰️. Reportar checkpoint a Checo.",
    joc:"⏰ Mañana vence la pasarela del anual. Confirmar que va a estar lista.",
    checks:["Reel viral publicado + repost TikTok","Mensaje D4+5 al canal","Stories con countdown","📍 CHECKPOINT: leads de días 1-3 revisados en Stats — semáforo aplicado","Form disparado a 800+57 ✅","TOQUE 1 enviado a los 39 leads del xlsx (alex primero) ✅","Si checkpoint 🔴: budget redistribuido al ad ganador HOY"] },

  { d:"2026-06-17", f:"F1", fl:"F1 D5 — polarización + pasarela urgente", pill:"gold",
    foco:"El contenido de hoy obliga a elegir bando: espectador vs constructor. Quien se siente espectador entra al curso para dejar de serlo. Joc entrega la pasarela del anual HOY — sin ella la ola fundador de mañana no tiene a dónde cobrar.",
    pub:"Reel: 'Cómo ser bueno en todo' 🩹 — contraste espectador/constructor. Pilar de Autoridad.",
    yt:"—",
    wpp:"Día 6 del PDF: Espectador vs Constructor.",
    sto:"BTS de ti operando (prueba de constructor real) + countdown 'el curso gratis cierra mañana'.",
    graba:"Lo que falte del batch 2 de ads.",
    marce:"Segmentar respuestas del form: 🟢 candidato Mentorship → llamada · 🟡 anual fundador → DM · 🔴 reactivación. Agendar llamadas para mié-vie.",
    joc:"🚨 ENTREGAR pasarela anual $169 hoy — sin esto no hay ola fundador mañana.",
    checks:["Reel + repost TikTok","Mensaje D6 al canal","Stories BTS + countdown","Form segmentado: tabla 🟢🟡🔴 lista","Llamadas agendadas para mié-vie","Pasarela anual $169 VIVA ✅ (Joc confirma)"] },

  { d:"2026-06-18", f:"F1", fl:"F1 D6 — ULTIMÁTUM + ARRANCA OLA DE DINERO 💰", pill:"red",
    foco:"Doble cierre: (1) el curso gratis 'cierra' a medianoche — urgencia real para que entren al grupo; (2) ARRANCA la ola de dinero real: primeras llamadas de Mentorship + DMs de anual fundador. También: desde hoy modo full (terminaron exámenes). Crea el hábito del cierre diario.",
    pub:"Reel: 'Un millonario salió con su esposa' 🔥 VIRAL — raw footage ya listo ✅, solo editar y subir.",
    yt:"—",
    wpp:"Día 7 del PDF: El Ultimátum de Entrada — 'hoy a medianoche cierro el acceso al curso'.",
    sto:"🟦 VENTAS mini: story 1: hook ('algo está a punto de cerrarse…') + sticker · story 2: qué incluye el curso + urgencia · story 3: CTA + countdown a medianoche. Es la primera vez que vendes directo por stories.",
    graba:"—",
    marce:"📞 PRIMERAS LLAMADAS de Mentorship ($397 o $497 según bolsillo; downsell al anual en la misma llamada si no es fit). DMs de anual fundador a los 🟡. TOQUE 2 a los leads del xlsx (info nueva + su objeción específica del historial).",
    joc:"Disponible para links de pago durante las llamadas.",
    checks:["Reel viral + repost","Mensaje D7 ultimátum","Stories de ventas (3) subidas","Llamadas del día hechas (anotar resultados)","DMs anual fundador enviados","TOQUE 2 enviado","Stats: ventas del día registradas (+/−)","Cierre del día: ¿qué movió la aguja? ¿rana de mañana?"] },

  { d:"2026-06-19", f:"F2a", fl:"F2 D7 — ARRANCA EL CURSO (nutrición) 🔬", pill:"purple",
    foco:"Cambio de registro: ya no atraes, ENTREGAS. El grupo entra al quirófano — reglas + tu historia real ($15-20K a los 13, FIFA Points). Las stories cambian a POSICIONAMIENTO (sin CTA): 14 repartidas hasta el 28. El orgánico sigue captando, pero la nutrición es el core.",
    pub:"Reel: '2 jóvenes despiertan un lunes' 🔥 viral.",
    yt:"'Cómo ser exitoso cuando te interesa todo' (editado por David — descripción con link al grupo).",
    wpp:"F2-D1 del PDF: Bienvenidos al Quirófano — reglas del grupo + historia ($15-20K, FIFA Points). CTA: 'Comenta CONSTRUCTOR'. Joc ancla el PDF Manifiesto como primer mensaje fijado.",
    sto:"🟫 POSICIONAMIENTO — Story 1/14: hook + contexto de quién eres y qué van a recibir. Story 2/14: tu operación real (no lo que dices, lo que haces).",
    graba:"—",
    marce:"Seguimiento de llamadas + DMs. Cada 'sí' → link de pago + mensaje de bienvenida. CPL diario anotado.",
    joc:"PDF Manifiesto anclado en el grupo ✅.",
    checks:["Reel + repost","Video YT arriba","Mensaje Quirófano + PDF Manifiesto anclado","Stories posicionamiento 1-2","Llamadas/DMs de seguimiento","Ventas y leads en Stats"] },

  { d:"2026-06-20", f:"F2a", fl:"F2 D8 — 🎬 MEGA BATCH DÍA 1", pill:"purple",
    foco:"EL DÍA DE PRODUCCIÓN MÁS IMPORTANTE DEL MES. Se graban los 3-4 videos largos de nutrición + YouTube sem 3. ¿Por qué hoy? Porque el fin del 27 es TeensClub y David necesita 8+ días de colchón. Si hoy sale bien, las próximas 2 semanas van en piloto automático.",
    pub:"Reel: Conexión #18 🩹.",
    yt:"—",
    wpp:"F2-D2 del PDF: La Deuda y el Desgaste — VOICE NOTE (la deuda de mamá, la abuela).",
    sto:"🟫 POSICIONAMIENTO — Stories 3-4/14: casos reales / tu operación real.",
    graba:"🎬 MEGA BATCH: Largo 1 'Hackeando la Atención' (12 min) + Largo 2 'Prospección sin rogar' (15 min) + YouTube sem 3 'Si eres ambicioso pero procrastinas'. TODO a Drive, avisar a David.",
    marce:"TOQUE 3 preparado para mañana (prueba + plan de pagos). Revisar qué ads rotar en semana 2 (los ⭐ ganan).",
    joc:"—",
    checks:["Reel + repost","Voice note La Deuda enviado","Stories 3-4","🎬 Largo 1 'Hackeando la Atención' grabado","🎬 Largo 2 'Prospección sin rogar' grabado","🎬 YT 'Procrastinas' grabado","TODO subido a Drive + David avisado"] },

  { d:"2026-06-21", f:"F2a", fl:"F2 D9 — 🎬 MEGA BATCH DÍA 2 → todo a David", pill:"purple",
    foco:"Se cierra el batch: Largos 3-4 + pendientes. TODO a Drive y a David hoy — con esto él tiene 8+ días para los videos que suben 30 jun-3 jul. Después de esto, tu producción pesada del mes está HECHA.",
    pub:"Reel: 'Top 5 nichos' 🩹 autoridad.",
    yt:"—",
    wpp:"F2-D3 del PDF: El Ego y el Nepo Baby (Halloween, reset de identidad).",
    sto:"🟫 POSICIONAMIENTO — Stories 5-6/14: educación en pedacitos (una habilidad, una táctica concreta).",
    graba:"🎬 Largo 3 'El Onboarding' (15 min) + Largo 4 'El Ultimátum' (12 min).",
    marce:"TOQUE 3: prueba + plan de pagos a los leads que no han respondido. Tabla final de semana fundador: cierres, downsells, leads que pasan al funnel.",
    joc:"—",
    checks:["Reel + repost","Mensaje Nepo Baby","Stories 5-6","🎬 Largo 3 'Onboarding' grabado","🎬 Largo 4 'Ultimátum' grabado","BATCH COMPLETO → David ✅ (tiene 8+ días)","Review semanal de stories en Stats (retención)","Sync con Marce: ¿cuántos cierres van? → Stats"] },

  { d:"2026-06-22", f:"F2a", fl:"F2 D10 — semana 2 de ads", pill:"purple",
    foco:"Semana 2: entran los creativos 11-20 con presupuesto cargado a los ángulos ⭐ de semana 1. El contenido del día: el primer dólar — la historia que planta la semilla de 'yo también puedo'.",
    pub:"Reel: 'Cómo ser bueno en TODO' 🔥 viral.",
    yt:"'Si eres ambicioso pero procrastinas' (editado por David — descripción con link).",
    wpp:"F2-D4 del PDF: El Hierro y el Primer Dólar (64 dominadas, primer cliente $250).",
    sto:"🟫 POSICIONAMIENTO — Stories 7-8/14: educación.",
    graba:"—",
    marce:"Rotación ads 11-20 al aire. Budget escalado al ⭐. TOQUE 3 (si no salió ayer).",
    joc:"Avance de módulos: ¿vamos a tiempo para el 25?",
    checks:["Reel + repost","Video YT arriba","Mensaje El Hierro","Stories 7-8","Ads sem 2 rotando ✅","TOQUE 3 enviado","Stats: ventas del día"] },

  { d:"2026-06-23", f:"F2a", fl:"F2 D11 — TOQUE 4: cierre de Operación Caja", pill:"purple",
    foco:"TOQUE 4: cierre de ciclo — un no también cierra en paz. Desde MAÑANA: cero DMs de oferta hasta la MC. El contenido del día gira la cámara hacia la fe y el fin del ego.",
    pub:"Reel: Conexión #15 🩹.",
    yt:"—",
    wpp:"F2-D5 del PDF: La Brújula Definitiva (la fe) — gira la cámara.",
    sto:"🟫 POSICIONAMIENTO — Stories 9-10/14: prueba social (capturas de gente en el grupo, mensajes reales).",
    graba:"—",
    marce:"TOQUE 4 (cierre de ciclo). Tabla FINAL de Operación Caja: cierres totales, cash generado. 🔕 DESDE MAÑANA: cero DMs de oferta. Ese cash va a Stats.",
    joc:"—",
    checks:["Reel + repost","Mensaje La Brújula","Stories 9-10","TOQUE 4 enviado — Operación Caja CERRADA ✅","Cash total de la Operación en Stats","Nota a Marce: mañana empieza el silencio de oferta"] },

  { d:"2026-06-24", f:"F2a", fl:"F2 D12 — prevención TeensClub", pill:"purple",
    foco:"TeensClub es en 2 días y va a comerte el viernes. HOY se deja pre-grabado el mensaje de WPP del 26 y se agenda el Reel de ese día. El lanzamiento no se entera de que tuviste evento.",
    pub:"Reel: Autoridad #11 🩹.",
    yt:"—",
    wpp:"F2-D6 del PDF: La Identidad Fracturada y el Bucle Tóxico.",
    sto:"🟫 POSICIONAMIENTO — Stories 11-12/14: prueba social + educación.",
    graba:"Mensaje WPP del 26 (pre-grabado y agendado) + Reel del 26 si se puede.",
    marce:"Solo monitoreo de ads. Sin ofertas.",
    joc:"Módulos: mañana es el DEADLINE.",
    checks:["Reel + repost","Mensaje Bucle Tóxico","Stories 11-12","Mensaje WPP del 26 PRE-GRABADO ✅","Contenido del 26 agendado en programador"] },

  { d:"2026-06-25", f:"F2a", fl:"F2 D13 — ⚠️ DEADLINE MÓDULOS JOC", pill:"amber",
    foco:"Hoy se cumple o se rompe la promesa interna: TODOS los módulos arriba (Brand Architect 7, Client Hunter, Client OS, Entrepreneur System). Quien compre en la MC tiene que entrar a una Academy COMPLETA. Checo audita entrando como alumno nuevo.",
    pub:"Reel: 'Best business 14-21' 🔥 viral.",
    yt:"—",
    wpp:"F2-D7 del PDF: La Ilusión del Movimiento y el Caos de Información.",
    sto:"🟫 POSICIONAMIENTO — Story 13/14: conexión humana (sin producto, sin CTA).",
    graba:"—",
    marce:"—",
    joc:"🚨 SUBIR TODO HOY. Brand Architect (7 módulos) + Client Hunter + Client OS + Entrepreneur System.",
    checks:["Reel + repost","Mensaje Ilusión del Movimiento","Story 13","Módulos 100% arriba ✅","Checo audita la Academy como alumno nuevo","Joc confirma a Checo: todo está"] },

  { d:"2026-06-26", f:"F2a", fl:"F2 D14 — 🎉 TEENSCLUB VOL.1", pill:"amber",
    foco:"Día de TeensClub: tu energía va al evento. El lanzamiento corre SOLO con lo pre-grabado. Bonus: el evento ES contenido — captura material para stories de prueba social ('esto también lo construí yo').",
    pub:"Reel: Tablero + Conexión #19 🩹 (agendado desde el 24).",
    yt:"'Cómo TENER 10x más dinero siendo JOVEN' (editado por David).",
    wpp:"F2-D8 del PDF: Comparación, Aura y Respeto (PRE-GRABADO, sale solo).",
    sto:"BTS del TeensClub: autoridad de operador en vivo. Cuenta como posicionamiento.",
    graba:"Material del evento (clips para stories posteriores).",
    marce:"Solo monitoreo.",
    joc:"—",
    checks:["Verificar que el mensaje pre-grabado salió ✅","Reel agendado salió ✅","Stories BTS del evento","🎉 ROMPERLA EN TEENSCLUB"] },

  { d:"2026-06-27", f:"F2a", fl:"F2 D15 — resaca de evento", pill:"purple",
    foco:"Día ligero a propósito. El mensaje del día ataca la excusa #1 del avatar ('no tengo tiempo'). Tarde: empieza el outline de slides de la MC.",
    pub:"Reel: Autoridad #14 🩹.",
    yt:"—",
    wpp:"F2-D9 del PDF: La Mentira del 'No Tengo Tiempo'.",
    sto:"🟫 POSICIONAMIENTO — Story 14/14: conexión humana final. ✅ SECUENCIA COMPLETA.",
    graba:"—",
    marce:"—",
    joc:"Waitlist form listo y probado para el lunes 29.",
    checks:["Reel + repost","Mensaje No Tengo Tiempo","Story 14 — secuencia POSICIONAMIENTO COMPLETA ✅","Outline de slides de la MC empezado","Waitlist form probado (Joc)"] },

  { d:"2026-06-28", f:"F2a", fl:"F2 D16 — puente al anuncio", pill:"purple",
    foco:"El mensaje de hoy planta el deseo y anuncia que MAÑANA pasa algo grande. Pivote de toda la Fase 2: de dar valor → abrir la puerta. Review semanal de stories en la noche.",
    pub:"Reel: 'Vendedores en el 2050' 🔥.",
    yt:"'10X más PRODUCTIVO estudiante-emprendedor' (David).",
    wpp:"F2-D10 del PDF: El Deseo Oculto y el Puente al Vehículo — 'mañana les cuento algo que llevo meses construyendo'.",
    sto:"Teaser del anuncio + caja de preguntas (día del Vehículo): '¿Cuál es tu mayor obstáculo para generar ingresos?'",
    graba:"—",
    marce:"Preparar flujo de DMs para la Waitlist de mañana (mensaje de confirmación listo).",
    joc:"Waitlist form FINAL. Flujo técnico: form → link al grupo → recordatorio automático para el 4 jul.",
    checks:["Reel + repost","Video YT arriba","Mensaje Deseo Oculto + teaser","Stories teaser + caja de preguntas","Review semanal de stories en Stats","Flujo de Waitlist probado y listo ✅"] },

  { d:"2026-06-29", f:"F2b", fl:"F2b D17 — 🔑 EL ANUNCIO + WAITLIST ABRE", pill:"red",
    foco:"EL DÍA GRANDE de la fase. Se anuncia PBA y abre la Waitlist. TODO cambia de CTA: ya no es 'curso gratis', es 'apúntate a la Waitlist'. Stories vuelven a TRÁFICO (6 nuevas). El anuncio se hace en el GRUPO primero (los del curso son VIP) y luego en orgánico.",
    pub:"Reel: Autoridad #1 🩹 + el anuncio en el caption.",
    yt:"—",
    wpp:"EL ANUNCIO del PDF: 'Lo que vine a decirles' + link directo a la Waitlist.",
    sto:"🟪 TRÁFICO nueva secuencia — Story 1/6: hook del anuncio ('llevo meses construyendo algo'). Story 2/6: qué es PBA y qué incluye.",
    graba:"—",
    marce:"Responder TODO DM y comentario del anuncio en el día. Registrar inscritos a Waitlist.",
    joc:"Monitorear el form en vivo. Si hay bugs: resolver inmediatamente.",
    checks:["ANUNCIO en el grupo ✅ (PRIMERO)","Reel con anuncio + repost","Stories 1-2 → Waitlist","DMs y comentarios respondidos","# inscritos del día anotado en Stats"] },

  { d:"2026-06-30", f:"F2b", fl:"F2b D18 — largo 1: Hackeando la Atención", pill:"blue",
    foco:"Arranca la artillería técnica: los videos largos que demuestran que la habilidad es REAL y aprendible. Hoy: Hackeando la Atención. + DM personal a cada inscrito de la Waitlist: 'ya estás adentro, la clase es el sábado 4'.",
    pub:"Reel: 'Consejo omegle' 🔥.",
    yt:"⭐ Largo 1: 'Hackeando la Atención' (12 min).",
    wpp:"Link al Largo 1 + mini-lección del PDF.",
    sto:"🟪 TRÁFICO — Stories 3-4/6: clips del largo + 'apúntate a la Waitlist antes del viernes'.",
    graba:"—",
    marce:"DM a cada inscrito de Waitlist: 'estás dentro, la Masterclass es el sábado 4, 12 PM MX, YouTube live'.",
    joc:"—",
    checks:["Reel + repost","Largo 1 arriba en YouTube","Mensaje al canal con el largo","Stories 3-4","DMs a Waitlist enviados ✅"] },

  { d:"2026-07-01", f:"F2b", fl:"F2b D19 — largo 2: Prospección sin rogar", pill:"blue",
    foco:"El video que mata el miedo #1 del avatar: vender se siente como rogar. Todo el día empuja a la Waitlist con countdown 'cierra el viernes'.",
    pub:"Reel: Conexión #16 🩹.",
    yt:"⭐ Largo 2: 'La Prospección sin rogar' (15 min).",
    wpp:"Link al Largo 2 + mini-lección del PDF.",
    sto:"🟪 TRÁFICO — Story 5/6: aprendizaje del largo + countdown 'Waitlist cierra el viernes 23:59'.",
    graba:"—",
    marce:"Seguimiento de Waitlist. ¿Va lento? Push en el grupo con prueba social (# de inscritos, mensajes del grupo).",
    joc:"—",
    checks:["Reel + repost","Largo 2 arriba","Mensaje al canal","Story 5 con countdown","# inscritos registrado en Stats"] },

  { d:"2026-07-02", f:"F2b", fl:"F2b D20 — el video que se borra ⚡", pill:"blue",
    foco:"Doble golpe: Largo 3 + EL VIDEO EVENTO de YouTube: 'ESTE VIDEO SE BORRARÁ EN 48HRS'. Urgencia pura pre-MC. Quien lo ve corre a la Waitlist.",
    pub:"Reel: Autoridad #6 🩹.",
    yt:"⚡ 'ESTE VIDEO SE BORRARÁ EN 48HRS' (urgencia) + Largo 3: 'El Onboarding' (15 min).",
    wpp:"Link al Largo 3 + aviso del video de las 48 hrs.",
    sto:"🟪 TRÁFICO — Story 6/6: CTA FUERTE a Waitlist + clip del video de 48 hrs. ✅ Secuencia completa.",
    graba:"—",
    marce:"Push final de Waitlist a quien ya mostró interés pero no se inscribió.",
    joc:"Flujo del live del sábado probado: link de YouTube, recordatorios automáticos, pasarela activa.",
    checks:["Reel + repost","Video 48HRS arriba ⚡","Largo 3 arriba","Mensaje al canal","Story 6 CTA fuerte — secuencia TRÁFICO COMPLETA ✅","Flujo del live probado ✅"] },

  { d:"2026-07-03", f:"F2b", fl:"F2b D21 — ULTIMÁTUM · Waitlist cierra 23:59 🔴", pill:"red",
    foco:"Último día para entrar a la Waitlist. El Largo 4 confronta: 'mañana es la hora de la verdad'. Todo el día = countdown. En la noche: slides TERMINADAS + ensayo general de la MC.",
    pub:"Reel: Conexión #9 🩹.",
    yt:"⭐ Largo 4: 'El Ultimátum' (12 min).",
    wpp:"Ultimátum del PDF + 'la Waitlist se cierra HOY a medianoche'.",
    sto:"Countdown todo el día: 12h → 6h → 2h → 'CERRADA'.",
    graba:"Ensayo general de la MC (corre las slides completas una vez, graba para revisar).",
    marce:"Cierre de Waitlist 23:59. Conteo final de inscritos. Preparar mensajes del sábado: 8AM / 11AM / 11:45AM.",
    joc:"TODO listo para el live: link de YouTube configurado, pasarela de pago activa y probada.",
    checks:["Reel + repost","Largo 4 arriba","Mensaje ultimátum al canal","Stories countdown (4+ stories durante el día)","SLIDES TERMINADAS ✅","Ensayo general hecho","Waitlist CERRADA 23:59 ✅","# total de inscritos en Stats"] },

  { d:"2026-07-04", f:"MC", fl:"🔴 MASTERCLASS — 12:00 PM · YouTube EN VIVO", pill:"red",
    foco:"EL DÍA. Sigue el playbook hora por hora (tab Playbooks). En la clase: Ecosistema de 90 Días → tour de la Academy → OFERTA ANUAL PRIMERO con bonus (50% off + módulos día 1) → mensual plan B → Mentorship solo se menciona: 'si quieres ir más rápido, aplica por DM'. Stories en tiempo real todo el día.",
    pub:"—",
    yt:"🔴 EL LIVE a las 12 PM.",
    wpp:"8AM: 'Hoy es el día' → 11AM: modo avión, papel y pluma → 11:45: link del live 🔴 → post: gratitud.",
    sto:"🟦 VENTAS en tiempo real: 'faltan 4h' → modo avión → link → screenshots del live → primeras entradas.",
    graba:"—",
    marce:"Setting en vivo: responder DMs del live, mandar links de pago, registrar CADA venta en Stats en tiempo real.",
    joc:"Soporte técnico del live + monitorear pasarela.",
    checks:["8AM mensaje '¿Hoy es el día' ✅","11AM ultimátum de preparación ✅","11:45 link del live ✅","🔴 MC DADA ✅","Mensaje de gratitud post-clase","Stories en tiempo real completas","Ventas del día en Stats (+/−)"] },

  { d:"2026-07-05", f:"F3", fl:"F3 D23 — embudo 2 pasos", pill:"blue",
    foco:"Arranca el cierre. AM: inbound — se responde a todo el que comentó/escribió durante la MC. PM: se 'quema' la Waitlist — DM a cada inscrito que no compró: '¿qué te detuvo?'. Stories entran en modo VENTAS (3) y así se quedan hasta el 12.",
    pub:"Reel: clip de la MC (el momento más potente).",
    yt:"—",
    wpp:"Apertura oficial de puertas + recap de la oferta del PDF.",
    sto:"🟦 VENTAS D1: hook (lo que pasó en la clase) → prueba (primeras entradas) → CTA 'Comenta ENTRAR'.",
    graba:"—",
    marce:"AM: inbound. PM: quemar Waitlist 1x1. Llamadas a quienes pidan hablar (anual default, Mentorship al calificado).",
    joc:"—",
    checks:["Clip de la MC publicado + repost","Mensaje apertura de puertas","Stories de ventas (3) subidas","Inbound respondido","Waitlist quemada","Ventas en Stats"] },

  { d:"2026-07-06", f:"F3", fl:"F3 D24 — marco 'Mateo' (dinero)", pill:"blue",
    foco:"Marco 1: objeción del dinero. El caso Mateo muestra que la falta de dinero inmediato no es excusa — hay plan de pagos y el anual es $14/mes. Se anuncia el cierre en piedra: domingo 12, 23:59.",
    pub:"Reel: clip del Largo 1.",
    yt:"—",
    wpp:"Caso 'Mateo' + cierre anunciado en piedra.",
    sto:"🟦 VENTAS D2 con el marco del día + prueba social nueva.",
    graba:"—",
    marce:"Llamadas + seguimiento 'cupo a cupo'.",
    joc:"—",
    checks:["Reel + repost","Mensaje Mateo","Stories de ventas","Llamadas del día","Ventas en Stats"] },

  { d:"2026-07-07", f:"F3", fl:"F3 D25 — marco 'Lucas' (abandono)", pill:"blue",
    foco:"Marco 2: 'voy a empezar y lo voy a dejar como todo'. El caso Lucas demuestra que el sistema sostiene aunque la motivación se caiga.",
    pub:"Reel: clip del Largo 2.",
    yt:"—",
    wpp:"Caso 'Lucas' — miedo al abandono.",
    sto:"🟦 VENTAS D3 con prueba social nueva.",
    graba:"—",
    marce:"Llamadas + seguimiento.",
    joc:"—",
    checks:["Reel + repost","Mensaje Lucas","Stories ventas","Llamadas","Ventas en Stats"] },

  { d:"2026-07-08", f:"F3", fl:"F3 D26 — marco 'Tomás' (edad/papás)", pill:"blue",
    foco:"Marco 3: 'soy muy joven / mis papás no me dejan'. Munición: ofrecer llamada CON los papás. Mitad del cierre — revisa el cash vs el base.",
    pub:"Reel: clip del Largo 3.",
    yt:"—",
    wpp:"Caso 'Tomás' — edad y papás.",
    sto:"🟦 VENTAS D4.",
    graba:"—",
    marce:"Llamadas (incluidas con papás si aplica).",
    joc:"—",
    checks:["Reel + repost","Mensaje Tomás","Stories ventas","Llamadas","Cash vs base revisado en header","Ventas en Stats"] },

  { d:"2026-07-09", f:"F3", fl:"F3 D27 — marco 'Marcos' (parálisis)", pill:"blue",
    foco:"Marco 4: 'lo voy a pensar' = parálisis por análisis. El costo de esperar. Si el cash va abajo del base: ACTIVA el playbook de semana floja HOY.",
    pub:"Reel: clip del Largo 4.",
    yt:"—",
    wpp:"Caso 'Marcos' — parálisis por análisis.",
    sto:"🟦 VENTAS D5.",
    graba:"—",
    marce:"Llamadas. Si va flojo: segunda pasada a los 🟢 + push anual a los 57.",
    joc:"—",
    checks:["Reel + repost","Mensaje Marcos","Stories ventas","Llamadas","¿Cash abajo del base? → playbook activado","Ventas en Stats"] },

  { d:"2026-07-10", f:"F3", fl:"F3 D28 — marco 5: NO hay garantía", pill:"blue",
    foco:"El marco más contraintuitivo: de frente que NO hay garantía de resultados — solo de claridad. Filtra a los turistas y cierra a los serios. La honestidad ES el cierre.",
    pub:"Reel: el mejor clip restante.",
    yt:"—",
    wpp:"Marco 5: NO hay garantía de resultados, solo de claridad.",
    sto:"🟦 VENTAS D6 con prueba nueva.",
    graba:"—",
    marce:"Llamadas finales agendadas para mañana-domingo.",
    joc:"—",
    checks:["Reel + repost","Mensaje NO garantía","Stories ventas","Llamadas","Ventas en Stats"] },

  { d:"2026-07-11", f:"F3", fl:"F3 D29 — últimas 24 horas ⏱️", pill:"red",
    foco:"Countdown absoluto. Todo el contenido del día es UNA cosa: mañana a las 23:59 se apaga el link. Sin marcos nuevos — pura decisión.",
    pub:"Reel: 'últimas 24 horas' (directo a cámara, crudo).",
    yt:"—",
    wpp:"Límite de tiempo absoluto — las últimas 24 hrs.",
    sto:"🟦 Countdown en tiempo real: 24h → 18h → 12h.",
    graba:"—",
    marce:"Último día completo de llamadas. Mensaje 1x1 a todo carrito abandonado.",
    joc:"—",
    checks:["Reel últimas 24h + repost","Mensaje límite","Stories countdown","Llamadas finales","Ventas en Stats"] },

  { d:"2026-07-12", f:"F3", fl:"F3 D30 — ÚLTIMO DÍA · 23:59 SE APAGA 🔴", pill:"red",
    foco:"El día del cierre real. Countdown hasta el final: 12h → 6h → 2h → 30 min → CERRADO. A las 23:59 el link MUERE — y muere de verdad. La congruencia es el activo del lanzamiento 2.",
    pub:"Reel: 'hoy se cierra' (countdown en caption).",
    yt:"—",
    wpp:"ÚLTIMO DÍA: secuencia de mensajes (mañana / tarde / noche / 23:00).",
    sto:"🟦 Countdown total hasta 'CERRADO'.",
    graba:"—",
    marce:"Cierres de último minuto. 23:59: APAGAR el link de pago.",
    joc:"Desactivar checkout a las 23:59.",
    checks:["Reel cierre + repost","Secuencia de mensajes del día","Stories countdown completas","23:59 LINK APAGADO ✅","Ventas finales en Stats"] },

  { d:"2026-07-13", f:"POST", fl:"D31 — PUERTAS CERRADAS · SILENCIO 🙏", pill:"gray",
    foco:"Silencio total en oferta. Hoy: (1) onboarding a TODOS los que entraron, (2) números finales en Stats, (3) retro de 30 min con Marce y Joc: qué jaló, qué no, qué cambia para el lanzamiento 2. Y descansa — te lo ganaste.",
    pub:"—",
    yt:"—",
    wpp:"Onboarding: bienvenida a alumnos nuevos + instrucciones de acceso.",
    sto:"Gratitud (sin venta).",
    graba:"—",
    marce:"Reporte final: ventas por fuente, CPL promedio, tasa de cierre de llamadas.",
    joc:"Onboarding técnico: acceso a todos los alumnos verificado.",
    checks:["Onboarding enviado a alumnos","Stats finales capturados","Retro de equipo hecha (30 min)","Reporte mensual con business-administrator","DESCANSAR 🙏"] }
]

const PILL_COLORS = {
  gold: { bg: 'rgba(250,204,21,.15)', color: '#FACC15' },
  red: { bg: 'rgba(239,68,68,.15)', color: '#FCA5A5' },
  purple: { bg: 'rgba(167,139,250,.15)', color: '#C4B5FD' },
  blue: { bg: 'rgba(96,165,250,.15)', color: '#93C5FD' },
  amber: { bg: 'rgba(245,158,11,.15)', color: '#FCD34D' },
  gray: { bg: 'rgba(142,142,152,.15)', color: '#B9B9C2' }
}
const FASE_NAMES = { D0:'Día 0', F1:'Fase 1 · Atracción', F2a:'Fase 2 · Nutrición', F2b:'Fase 2b · Waitlist', MC:'Masterclass', F3:'Fase 3 · Cierre', POST:'Post' }

const s = (prop, fallback) => ({ style: { [prop]: fallback } })

function Pill({ c, children }) {
  const p = PILL_COLORS[c] || PILL_COLORS.gray
  return <span style={{ display:'inline-block', padding:'2px 9px', borderRadius:99, fontSize:11, fontWeight:700, background:p.bg, color:p.color }}>{children}</span>
}

function Card({ children, highlight }) {
  return <div style={{ background: highlight ? 'rgba(250,204,21,.07)' : 'var(--panel)', border: `1px solid ${highlight ? 'var(--gold)' : 'var(--line)'}`, borderRadius:14, padding:'18px', marginBottom:14 }}>{children}</div>
}

function Progress({ value }) {
  return <div style={{ height:6, background:'var(--panel2)', borderRadius:99, overflow:'hidden', margin:'6px 0 12px' }}>
    <div style={{ height:'100%', background:'var(--gold)', width:`${Math.min(100,value||0)}%`, transition:'width .3s' }} />
  </div>
}

function Counter({ val, onInc, onDec, label, cash }) {
  return <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:12, padding:'14px' }}>
    <div style={{ fontSize:11, color:'var(--mut)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>{label}</div>
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <button onClick={onDec} style={{ width:34, height:34, borderRadius:9, border:'1px solid var(--line)', background:'var(--panel2)', color:'var(--gold)', fontSize:18, fontWeight:900, cursor:'pointer' }}>−</button>
      <span style={{ fontFamily:'Archivo', fontSize:22, fontWeight:900, minWidth:34, textAlign:'center' }}>{val}</span>
      <button onClick={onInc} style={{ width:34, height:34, borderRadius:9, border:'1px solid var(--line)', background:'var(--panel2)', color:'var(--gold)', fontSize:18, fontWeight:900, cursor:'pointer' }}>+</button>
    </div>
    <div style={{ color:'var(--mut)', fontSize:12, marginTop:4 }}>${(val * cash).toLocaleString()}</div>
  </div>
}

/* ─────────────────────────────── MAIN ─────────────────────────────── */
export default function Dashboard() {
  const [tab, setTab] = useState('hoy')
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [now, setNow] = useState(Date.now())
  const saveTimer = useRef(null)

  // Load from API
  useEffect(() => {
    fetch('/api/state').then(r => r.json()).then(d => {
      setState(d.error ? getDefault() : d)
      setLoading(false)
    }).catch(() => { setState(getDefault()); setLoading(false) })
  }, [])

  // Tick countdowns
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [])

  function getDefault() {
    return { ventas:{ men:0, anu:0, fun:0, m397:0, m497:0 }, checklists:{}, leads:[], ads:[], stories:[] }
  }

  // Debounced save
  const save = useCallback((newState) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      try { await fetch('/api/state', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(newState) }) }
      catch(e) {}
      setSaving(false)
    }, 800)
  }, [])

  function update(fn) {
    setState(prev => {
      const next = fn({ ...prev })
      save(next)
      return next
    })
  }

  if (loading || !state) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'var(--mut)', fontFamily:'Inter' }}>
      Cargando el centro de mando…
    </div>
  )

  // Cash calc
  const cash = MRR_BASE + (state.ventas.men*37) + (state.ventas.anu*169) + (state.ventas.fun*169) + (state.ventas.m397*397) + (state.ventas.m497*497)
  const cashPct = Math.min(100, cash / ESCENARIOS.meta * 100)
  const today = new Date().toLocaleDateString('sv', { timeZone:'America/Mexico_City' })

  // Countdown helper
  function countdown(target) {
    const t = new Date(target) - now
    if (t <= 0) return '✅ Pasó'
    const d = Math.floor(t/864e5), h = Math.floor(t%864e5/36e5), m = Math.floor(t%36e5/6e4)
    return `${d}d ${h}h ${m}m`
  }

  // Diagnóstico de ventas
  const mentorships = (state.ventas.m397||0) + (state.ventas.m497||0)
  let dx = ''
  if (cash < 3000) dx = `⏳ Arrancando. La primera meta: 1 mentorship esta semana fundador — cambia el mes.`
  else if (cash < ESCENARIOS.piso) dx = `📍 Debajo del piso ($7.4K). Mentorships: ${mentorships}/4. Activa el playbook de semana floja si ya pasó la MC.`
  else if (cash < ESCENARIOS.diez) dx = `📈 Arriba del piso, persiguiendo los $10K. Mentorships: ${mentorships}/4.`
  else if (cash < ESCENARIOS.base) dx = `🎉 Cruzaste los $10K. Ahora el BASE ($11.85K). Mentorships: ${mentorships}.`
  else dx = `🔥 ARRIBA DEL BASE. Mentorships: ${mentorships}. A por $15.3K — documenta TODO para el lanzamiento 2.`

  const TABS = [
    { k:'hoy', label:'📅 HOY' }, { k:'stats', label:'📊 Stats' },
    { k:'norte', label:'Norte' }, { k:'ofertas', label:'Ofertas' },
    { k:'caja', label:'Op. Caja' }, { k:'contenido', label:'Contenido' },
    { k:'playbooks', label:'Playbooks' }
  ]

  const tabStyle = (k) => ({
    background:'none', border:'none', color: tab===k ? 'var(--gold)' : 'var(--mut)',
    font:'600 13px Inter', padding:'14px 12px', cursor:'pointer',
    borderBottom: tab===k ? '2px solid var(--gold)' : '2px solid transparent',
    whiteSpace:'nowrap'
  })

  const h3 = { fontFamily:'Archivo', fontSize:16, fontWeight:700, color:'var(--gold)', margin:'24px 0 10px' }
  const mut = { color:'var(--mut)', fontSize:13 }
  const grid3 = { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px 80px' }}>

      {/* HEADER */}
      <div style={{ padding:'40px 0 20px', borderBottom:'1px solid var(--line)' }}>
        <div style={{ color:'var(--gold)', fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', fontSize:12 }}>Project Boy Academy · Centro de Mando</div>
        <h1 style={{ fontSize:'clamp(26px,4.5vw,44px)', fontWeight:900, lineHeight:1.05, margin:'8px 0 6px' }}>
          LANZAMIENTO <span style={{ color:'var(--gold)' }}>PBA</span>
        </h1>
        <p style={{ color:'var(--mut)', fontSize:14 }}>Abre <strong style={{ color:'var(--txt)' }}>HOY</strong> cada mañana, ejecuta, palomea. <strong style={{ color:'var(--txt)' }}>Stats</strong> cada noche. Todo se sincroniza con el equipo. {saving && <span style={{ color:'var(--amber)' }}>Guardando…</span>}</p>

        {/* Countdowns */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:10, marginTop:18 }}>
          {[
            ['Cierre curso gratis', '2026-06-18T23:59:00-06:00'],
            ['Cierre Waitlist', '2026-07-03T23:59:00-06:00'],
            ['🔴 Masterclass YT Live', '2026-07-04T12:00:00-06:00'],
            ['CIERRE DE PUERTAS', '2026-07-12T23:59:00-06:00'],
          ].map(([l, t]) => (
            <div key={t} style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:12, padding:'13px 15px' }}>
              <div style={{ fontSize:11, color:'var(--mut)', textTransform:'uppercase', letterSpacing:'.1em' }}>{l}</div>
              <div style={{ fontFamily:'Archivo', fontSize:22, fontWeight:900, color:'var(--gold)', marginTop:3 }}>{countdown(t)}</div>
            </div>
          ))}
        </div>

        {/* Cash bar */}
        <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:14, padding:'16px 18px', marginTop:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', flexWrap:'wrap', gap:8 }}>
            <div>
              <div style={{ fontSize:11, color:'var(--mut)', textTransform:'uppercase', letterSpacing:'.1em' }}>Cash del mes (auto)</div>
              <div style={{ fontFamily:'Archivo', fontSize:34, fontWeight:900, color:'var(--gold)' }}>${cash.toLocaleString()}</div>
            </div>
            <div style={{ color:'var(--mut)', fontSize:13 }}>🔴 Piso $7.4K · 🟡 Base $11.85K · 🟢 Meta $15.3K</div>
          </div>
          <div style={{ position:'relative', height:14, background:'var(--panel2)', borderRadius:99, marginTop:12, overflow:'visible' }}>
            <div style={{ position:'absolute', left:0, top:0, height:'100%', background:'linear-gradient(90deg,#A16207,#FACC15)', borderRadius:99, width:`${cashPct}%`, transition:'width .4s' }} />
            {[['46.4%','Piso 7.4K','var(--mut)'],['62.7%','$10K','var(--amber)'],['74.3%','Base 11.85K','var(--amber)'],['96%','Meta 15.3K','var(--green)']].map(([l,lab,c]) => (
              <div key={l} style={{ position:'absolute', top:-5, left:l, width:2, height:24, background:c }}>
                <span style={{ position:'absolute', top:26, left:'50%', transform:'translateX(-50%)', fontSize:10, color:c, whiteSpace:'nowrap' }}>{lab}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:24, padding:'10px 12px', background:'var(--panel2)', borderRadius:10, fontSize:13 }}>{dx}</div>
        </div>
      </div>

      {/* NAV */}
      <div style={{ position:'sticky', top:0, background:'rgba(11,11,13,.93)', backdropFilter:'blur(8px)', borderBottom:'1px solid var(--line)', zIndex:50, marginBottom:2 }}>
        <div style={{ display:'flex', gap:2, overflowX:'auto' }}>
          {TABS.map(t => <button key={t.k} style={tabStyle(t.k)} onClick={() => setTab(t.k)}>{t.label}</button>)}
        </div>
      </div>

      {/* ══════════════════ HOY ══════════════════ */}
      {tab === 'hoy' && (
        <div style={{ paddingTop:28 }}>
          <h2 style={{ fontFamily:'Archivo', fontSize:22, fontWeight:900 }}>El lanzamiento, día por día</h2>
          <p style={{ ...mut, marginBottom:16 }}>Cada día trae: 📱 qué se publica · ▶️ YouTube · 💬 WPP · 📲 Stories · 🎬 qué se graba · 💰 Marce · 📦 Joc. El día de HOY se marca en dorado. Los guiones se hacen el mismo día con <code style={{ background:'var(--panel2)', padding:'1px 6px', borderRadius:5 }}>idea-machine</code> + <code style={{ background:'var(--panel2)', padding:'1px 6px', borderRadius:5 }}>script-master</code>.</p>

          {DAYS.map((D, i) => {
            const isToday = D.d === today
            const checks = state.checklists[D.d] || {}
            const total = D.checks.length
            const done = D.checks.filter((_, j) => checks[j]).length
            const pct = total > 0 ? (done / total * 100) : 0
            const dt = new Date(D.d + 'T12:00:00')
            const DNAMES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
            const fecha = `${DNAMES[dt.getDay()]} ${dt.getDate()} ${dt.getMonth()===5?'jun':'jul'}`
            const pc = PILL_COLORS[D.pill] || PILL_COLORS.gray

            return (
              <details key={D.d} open={isToday} style={{ background:'var(--panel)', border:`1px solid ${isToday ? 'var(--gold)' : 'var(--line)'}`, borderRadius:14, marginBottom:10, overflow:'hidden', boxShadow: isToday ? '0 0 0 1px var(--gold)' : 'none' }}>
                <summary style={{ cursor:'pointer', padding:'13px 18px', fontFamily:'Archivo', fontWeight:700, fontSize:14.5, listStyle:'none', display:'flex', justifyContent:'space-between', alignItems:'center', gap:10 }}>
                  <span style={{ color: isToday ? 'var(--gold)' : 'var(--txt)', minWidth:74 }}>{fecha}</span>
                  <span style={{ flex:1 }}>{D.fl} {isToday && <Pill c="gold">HOY</Pill>}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:8, marginLeft:'auto' }}>
                    <span style={{ background: pc.bg, color: pc.color, padding:'2px 9px', borderRadius:99, fontSize:11, fontWeight:700 }}>{FASE_NAMES[D.f]}</span>
                    <span style={{ display:'inline-block', width:50, height:5, background:'var(--panel2)', borderRadius:99, overflow:'hidden' }}>
                      <span style={{ display:'block', height:'100%', background:'var(--gold)', width:`${pct}%` }} />
                    </span>
                    <span style={{ fontSize:19, color:'var(--gold)' }}>+</span>
                  </span>
                </summary>
                <div style={{ padding:'0 18px 18px' }}>

                  {/* Foco */}
                  <div style={{ background:'var(--gold-dim)', borderRadius:10, padding:'11px 13px', fontSize:13, margin:'8px 0 12px' }}>
                    🎯 <strong>FOCO:</strong> {D.foco}
                  </div>

                  {/* Boxes */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:10, margin:'10px 0' }}>
                    {[
                      ['📱 Se publica (Reel + TikTok)', D.pub],
                      ['▶️ YouTube', D.yt],
                      ['💬 WhatsApp canal', D.wpp],
                      ['📲 Stories', D.sto],
                      ['🎬 Se graba', D.graba],
                      ['💰 Marce', D.marce],
                      ['📦 Joc', D.joc],
                    ].map(([t, v]) => (
                      <div key={t} style={{ background:'var(--panel2)', border:'1px solid var(--line)', borderRadius:10, padding:'11px 13px', fontSize:13 }}>
                        <div style={{ fontSize:10.5, color:'var(--mut)', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:700, marginBottom:4 }}>{t}</div>
                        {v}
                      </div>
                    ))}
                  </div>

                  {/* Checklist */}
                  <div style={{ marginTop:14 }}>
                    <div style={{ fontFamily:'Archivo', fontWeight:700, fontSize:13.5, marginBottom:6 }}>Checklist del día <span style={{ color:'var(--mut)', fontWeight:400, fontFamily:'Inter' }}>({done}/{total})</span></div>
                    <Progress value={pct} />
                    {D.checks.map((c, j) => (
                      <label key={j} style={{ display:'flex', gap:9, alignItems:'flex-start', padding:'7px 9px', borderRadius:9, cursor:'pointer', fontSize:13.5 }}
                        onMouseEnter={e => e.currentTarget.style.background='var(--panel2)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <input type="checkbox" checked={!!checks[j]} style={{ marginTop:3, accentColor:'var(--gold)', width:15, height:15, flexShrink:0 }}
                          onChange={e => update(s => {
                            const cl = { ...(s.checklists || {}) }
                            cl[D.d] = { ...(cl[D.d] || {}), [j]: e.target.checked }
                            s.checklists = cl
                            return s
                          })} />
                        <span style={{ color: checks[j] ? 'var(--mut)' : 'var(--txt)', textDecoration: checks[j] ? 'line-through' : 'none' }}>{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </details>
            )
          })}
        </div>
      )}

      {/* ══════════════════ STATS ══════════════════ */}
      {tab === 'stats' && (
        <div style={{ paddingTop:28 }}>
          <h2 style={{ fontFamily:'Archivo', fontSize:22, fontWeight:900 }}>Stats del lanzamiento</h2>
          <p style={{ ...mut, marginBottom:18 }}>Llena las ventas con +/−. Log de leads en la noche. Review de stories los domingos. Todo se sincroniza con el equipo.</p>

          {/* Ventas */}
          <h3 style={h3}>💵 Ventas — botones +/− (el cash se calcula solo)</h3>
          <div style={grid3}>
            {[
              ['men', 'Mensual $37', 37],
              ['anu', 'Anual $169 (nuevos)', 169],
              ['fun', 'Anual fundador $169 (57+caja)', 169],
              ['m397', 'Mentorship $397', 397],
              ['m497', 'Mentorship $497', 497],
            ].map(([k, label, price]) => (
              <Counter key={k} val={state.ventas[k]||0} label={label} cash={price}
                onInc={() => update(s => { s.ventas = {...s.ventas, [k]:(s.ventas[k]||0)+1}; return s })}
                onDec={() => update(s => { s.ventas = {...s.ventas, [k]:Math.max(0,(s.ventas[k]||0)-1)}; return s })} />
            ))}
            <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:12, padding:'14px' }}>
              <div style={{ fontSize:11, color:'var(--mut)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>MRR colchón</div>
              <div style={{ fontFamily:'Archivo', fontSize:22, fontWeight:900, color:'var(--gold)' }}>$654</div>
              <div style={mut}>fijo</div>
            </div>
          </div>

          {/* Checkpoint */}
          <h3 style={h3}>🎯 Leads diarios + CPL</h3>
          <Card>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10, alignItems:'end' }}>
              {[['lg-date','date','Fecha'],['lg-leads','number','Leads nuevos'],['lg-spend','number','Gasto ads $'],['lg-total','number','Total grupo']].map(([id,t,l]) => (
                <div key={id}><div style={mut}>{l}</div>
                  <input id={id} type={t} placeholder={t==='number'?'0':''} style={{ background:'var(--panel2)', border:'1px solid var(--line)', borderRadius:8, color:'var(--txt)', padding:'7px 10px', font:'500 13px Inter', width:'100%' }} /></div>
              ))}
              <button onClick={() => {
                const d = document.getElementById('lg-date').value
                const l = parseInt(document.getElementById('lg-leads').value||0)
                const sp = parseFloat(document.getElementById('lg-spend').value||0)
                const tot = document.getElementById('lg-total').value
                if(!d) return alert('Pon la fecha')
                update(s => {
                  const rows = (s.leads||[]).filter(r => r.d !== d)
                  rows.push({ d, l, sp, tot })
                  s.leads = rows
                  return s
                })
                ;['lg-leads','lg-spend','lg-total'].forEach(id => { const el=document.getElementById(id); if(el) el.value='' })
              }} style={{ background:'var(--gold)', color:'#111', border:'none', borderRadius:9, padding:'9px 16px', font:'700 13px Inter', cursor:'pointer', alignSelf:'end' }}>Guardar</button>
            </div>

            {/* Tabla leads */}
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, marginTop:14 }}>
              <thead><tr style={{ borderBottom:'1px solid var(--line)' }}>
                {['Fecha','Leads','Gasto','CPL','Total grupo',''].map(h => <th key={h} style={{ textAlign:'left', padding:'7px 9px', color:'var(--mut)', fontSize:11, textTransform:'uppercase', letterSpacing:'.06em' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {(state.leads||[]).sort((a,b)=>a.d.localeCompare(b.d)).map((r,i) => {
                  const cpl = r.l > 0 ? (r.sp / r.l) : 0
                  return <tr key={i} style={{ borderBottom:'1px solid var(--line)' }}>
                    <td style={{ padding:'8px 9px' }}>{r.d}</td>
                    <td style={{ padding:'8px 9px' }}>{r.l}</td>
                    <td style={{ padding:'8px 9px' }}>${r.sp?.toFixed(2)}</td>
                    <td style={{ padding:'8px 9px', color: cpl > 1.5 ? '#FCA5A5' : 'var(--txt)' }}>{r.l > 0 ? '$'+cpl.toFixed(2) : '—'}</td>
                    <td style={{ padding:'8px 9px' }}>{r.tot||'—'}</td>
                    <td style={{ padding:'8px 9px' }}><button onClick={() => update(s => { s.leads=(s.leads||[]).filter((_,j)=>j!==i); return s })} style={{ background:'none', border:'none', color:'var(--mut)', cursor:'pointer', fontSize:15 }}>✕</button></td>
                  </tr>
                })}
              </tbody>
            </table>

            {/* KPIs y checkpoint */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10, marginTop:14 }}>
              {(() => {
                const rows = state.leads||[]
                const totLeads = rows.reduce((a,r)=>a+r.l,0)
                const totSpend = rows.reduce((a,r)=>a+r.sp,0)
                const avgCpl = totLeads > 0 && totSpend > 0 ? '$'+(totSpend/totLeads).toFixed(2) : '—'
                const cp = rows.filter(r=>r.d>='2026-06-13'&&r.d<='2026-06-15').reduce((a,r)=>a+r.l,0)
                let cpTxt, cpColor
                if(cp === 0) { cpTxt='Aún sin datos 13-15'; cpColor='var(--mut)' }
                else if(cp >= 600) { cpTxt=`🟢 ${cp} leads`; cpColor='var(--green)' }
                else if(cp >= 300) { cpTxt=`🟡 ${cp} leads`; cpColor='var(--amber)' }
                else { cpTxt=`🔴 ${cp} leads`; cpColor='var(--red)' }
                return <>
                  <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:12, padding:14 }}>
                    <div style={{ fontSize:11, color:'var(--mut)', textTransform:'uppercase', letterSpacing:'.08em' }}>Leads acumulados</div>
                    <div style={{ fontFamily:'Archivo', fontSize:24, fontWeight:900, color:'var(--gold)' }}>{totLeads}</div>
                  </div>
                  <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:12, padding:14 }}>
                    <div style={{ fontSize:11, color:'var(--mut)', textTransform:'uppercase', letterSpacing:'.08em' }}>CPL promedio</div>
                    <div style={{ fontFamily:'Archivo', fontSize:24, fontWeight:900, color:'var(--gold)' }}>{avgCpl}</div>
                  </div>
                  <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:12, padding:14 }}>
                    <div style={{ fontSize:11, color:'var(--mut)', textTransform:'uppercase', letterSpacing:'.08em' }}>Gasto / $500</div>
                    <div style={{ fontFamily:'Archivo', fontSize:24, fontWeight:900, color:'var(--gold)' }}>${totSpend.toFixed(0)}</div>
                  </div>
                  <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:12, padding:14 }}>
                    <div style={{ fontSize:11, color:'var(--mut)', textTransform:'uppercase', letterSpacing:'.08em' }}>📍 Checkpoint</div>
                    <div style={{ fontFamily:'Archivo', fontSize:18, fontWeight:900, color: cpColor }}>{cpTxt}</div>
                  </div>
                </>
              })()}
            </div>
            <div style={{ marginTop:10, ...mut }}>CPL sano: $0.50-1.00. Arriba de $1.50 = ese ad muere. Checkpoint 🟢 +600 · 🟡 300-600 · 🔴 &lt;300 (leads de los días 13-15).</div>
          </Card>

          {/* Ads */}
          <h3 style={h3}>📵 Ads — control de vida y muerte</h3>
          <Card>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:10, alignItems:'end' }}>
              <div><div style={mut}>Nombre del ad</div>
                <input id="ad-name" placeholder="Ad 03 - hook dependencia" style={{ background:'var(--panel2)', border:'1px solid var(--line)', borderRadius:8, color:'var(--txt)', padding:'7px 10px', font:'500 13px Inter', width:'100%' }} /></div>
              <div><div style={mut}>Estado</div>
                <select id="ad-status" style={{ background:'var(--panel2)', border:'1px solid var(--line)', borderRadius:8, color:'var(--txt)', padding:'7px 10px', font:'500 13px Inter', width:'100%' }}>
                  <option>🟢 Vivo</option><option>🟡 Vigilancia</option><option>🔴 Muerto</option><option>⭐ Ganador</option>
                </select></div>
              <button onClick={() => {
                const n = document.getElementById('ad-name').value.trim()
                if(!n) return
                const st = document.getElementById('ad-status').value
                update(s => { s.ads = [...(s.ads||[]), {n, st}]; return s })
                document.getElementById('ad-name').value = ''
              }} style={{ background:'var(--gold)', color:'#111', border:'none', borderRadius:9, padding:'9px 16px', font:'700 13px Inter', cursor:'pointer' }}>+</button>
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, marginTop:12 }}>
              <thead><tr style={{ borderBottom:'1px solid var(--line)' }}>
                {['Ad','Estado',''].map(h => <th key={h} style={{ textAlign:'left', padding:'7px 9px', color:'var(--mut)', fontSize:11, textTransform:'uppercase' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {(state.ads||[]).map((r,i) => <tr key={i} style={{ borderBottom:'1px solid var(--line)' }}>
                  <td style={{ padding:'8px 9px' }}>{r.n}</td>
                  <td style={{ padding:'8px 9px' }}>{r.st}</td>
                  <td style={{ padding:'8px 9px' }}><button onClick={() => update(s => { s.ads=(s.ads||[]).filter((_,j)=>j!==i); return s })} style={{ background:'none', border:'none', color:'var(--mut)', cursor:'pointer' }}>✕</button></td>
                </tr>)}
              </tbody>
            </table>
            <div style={{ ...mut, marginTop:8 }}>Regla: 3 días sin jalar = 🔴 y su budget al ⭐. Los ángulos ⭐ dictan el batch 2 y los Shorts.</div>
          </Card>

          {/* Stories */}
          <h3 style={h3}>📲 Stories — análisis semanal (domingos)</h3>
          <Card>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:10, alignItems:'end' }}>
              {[['st-date','date','Semana de'],['st-v1','number','Views H1'],['st-vf','number','Views última'],['st-resp','number','# Respuestas'],['st-cal','number','Calidad 1-10']].map(([id,t,l]) => (
                <div key={id}><div style={mut}>{l}</div>
                  <input id={id} type={t} style={{ background:'var(--panel2)', border:'1px solid var(--line)', borderRadius:8, color:'var(--txt)', padding:'7px 10px', font:'500 13px Inter', width:'100%' }} /></div>
              ))}
              <button onClick={() => {
                const d = document.getElementById('st-date').value; if(!d) return alert('Pon la semana')
                const r = { d, v1:+document.getElementById('st-v1').value||0, vf:+document.getElementById('st-vf').value||0, resp:+document.getElementById('st-resp').value||0, cal:+document.getElementById('st-cal').value||0 }
                update(s => { s.stories = [...(s.stories||[]).filter(x=>x.d!==d), r]; return s })
                ;['st-v1','st-vf','st-resp','st-cal'].forEach(id => { const el=document.getElementById(id); if(el) el.value='' })
              }} style={{ background:'var(--gold)', color:'#111', border:'none', borderRadius:9, padding:'9px 16px', font:'700 13px Inter', cursor:'pointer', alignSelf:'end' }}>Guardar</button>
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, marginTop:12 }}>
              <thead><tr style={{ borderBottom:'1px solid var(--line)' }}>
                {['Semana','Retención','Respuestas','Calidad','Veredicto',''].map(h => <th key={h} style={{ textAlign:'left', padding:'7px 9px', color:'var(--mut)', fontSize:11, textTransform:'uppercase' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {(state.stories||[]).sort((a,b)=>a.d.localeCompare(b.d)).map((r,i) => {
                  const ret = r.v1 > 0 ? Math.round(r.vf/r.v1*100) : 0
                  const [v,c] = ret>=70 ? ['🟢 Sólida','#86EFAC'] : ret>=50 ? ['🟡 Mejorar hook','#FCD34D'] : ['🔴 Secuencia rota','#FCA5A5']
                  return <tr key={i} style={{ borderBottom:'1px solid var(--line)' }}>
                    <td style={{ padding:'8px 9px' }}>{r.d}</td>
                    <td style={{ padding:'8px 9px', color:c }}>{ret}%</td>
                    <td style={{ padding:'8px 9px' }}>{r.resp}</td>
                    <td style={{ padding:'8px 9px' }}>{r.cal}/10</td>
                    <td style={{ padding:'8px 9px', color:c }}>{v}</td>
                    <td><button onClick={() => update(s => { s.stories=(s.stories||[]).filter((_,j)=>j!==i); return s })} style={{ background:'none', border:'none', color:'var(--mut)', cursor:'pointer' }}>✕</button></td>
                  </tr>
                })}
              </tbody>
            </table>
            <div style={{ ...mut, marginTop:8 }}>Retención sana: 70%+. Abajo de 50% = hook de la story 1 no jala. Analizar domingos, no diario.</div>
          </Card>
        </div>
      )}

      {/* ══════════════════ NORTE ══════════════════ */}
      {tab === 'norte' && (
        <div style={{ paddingTop:28 }}>
          <h2 style={{ fontFamily:'Archivo', fontSize:22, fontWeight:900 }}>El Norte</h2>
          <div style={{ ...grid3, marginTop:14 }}>
            {[['Ventana','13 jun → 12 jul','Cierre 23:59 MX'],['Meta','$10,000','Base ~$11,850'],['Masterclass','Sáb 4 jul','12 PM · YouTube Live']].map(([l,v,s]) => (
              <Card key={l}><div style={mut}>{l}</div><div style={{ fontFamily:'Archivo', fontSize:28, fontWeight:900, color:'var(--gold)' }}>{v}</div><div style={mut}>{s}</div></Card>
            ))}
          </div>
          <h3 style={h3}>El embudo</h3>
          <div style={{ background:'var(--panel2)', border:'1px solid var(--line)', borderRadius:12, padding:16, fontFamily:'monospace', fontSize:12, overflow:'auto', whiteSpace:'pre', color:'#C9C9D2' }}>
{`ADS Meta ($500) ──┐
                  ├─→ CURSO GRATIS WhatsApp ─→ NUTRICIÓN ─→ WAITLIST ─→ MASTERCLASS ─→ VENTA
ORGÁNICO (CTAs) ──┘  "$1,000 en 3 meses"     (= el curso)   (filtro)   (YT live 4 jul)  $169 / $397-497`}
          </div>
          <div style={{ borderLeft:'3px solid var(--gold)', background:'var(--gold-dim)', padding:'13px 15px', borderRadius:'0 12px 12px 0', margin:'13px 0', fontSize:13.5 }}>
            ⚡ El grupo de WhatsApp SE VENDE como "curso gratis: $1,000 en 3 meses". La nutrición ES el curso. Ads SOLO al curso gratis — nunca directo a la MC.
          </div>
          <h3 style={h3}>Diagnóstico del Administrador</h3>
          <Card>
            <p>🔎 <strong>Cuello de botella:</strong> NO es traer leads — es <strong style={{ color:'var(--gold)' }}>monetizar lo que ya tienes</strong>. 79K seguidores dieron 208 visitas en 30 días: la audiencia nunca ha visto una oferta real.</p>
            <p style={{ marginTop:8 }}>🥇 <strong>Palanca #1:</strong> semana fundador + Operación Caja (16-20 jun). El base cruza $10K con ≥4 mentorships → las llamadas de Marce valen más que 50 Reels.</p>
          </Card>
          <h3 style={h3}>Las 10 Reglas de Oro</h3>
          <Card>
            <ol style={{ paddingLeft:20, display:'grid', gap:7, fontSize:13.5 }}>
              <li><strong>Anual primero, mensual plan B.</strong> Ticket alto primero al que califica.</li>
              <li><strong>Ads SOLO al curso gratis.</strong> La MC se vende desde dentro del grupo.</li>
              <li><strong>Ad muerto 3 días = apagado.</strong> La data de sem 1 dicta el batch 2.</li>
              <li><strong>Se mide contra el BASE ($11.8K).</strong> $7-8K + MRR creciendo = máquina construida.</li>
              <li><strong>Checkpoint mar 16</strong> = ajuste en caliente, no autopsia el día de la MC.</li>
              <li><strong>Regla 96 hrs:</strong> nada se sube sin grabarse el fin anterior.</li>
              <li><strong>Guiones:</strong> según objetivo del día + pilar, con idea-machine + script-master.</li>
              <li><strong>Stories:</strong> un objetivo por secuencia, CTA solo al final.</li>
              <li><strong>El cierre del 12 jul es REAL.</strong> La congruencia es el activo del lanzamiento 2.</li>
              <li><strong>Dormir es parte del plan.</strong> Maratón, no sprint.</li>
            </ol>
          </Card>
        </div>
      )}

      {/* ══════════════════ OFERTAS ══════════════════ */}
      {tab === 'ofertas' && (
        <div style={{ paddingTop:28 }}>
          <h2 style={{ fontFamily:'Archivo', fontSize:22, fontWeight:900 }}>Ofertas & Mate</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:13, marginTop:14 }}>
            <Card><Pill c="gold">LOW</Pill><div style={{ fontFamily:'Archivo', fontSize:28, fontWeight:900, margin:'8px 0 4px' }}>$37/mes · <span style={{ color:'var(--gold)' }}>$169 anual</span></div><p style={mut}>Bonus anual: 50% off + TODOS los módulos día 1. Se ofrece PRIMERO; el mensual es plan B.</p><h4 style={{ marginTop:12, fontSize:13 }}>Cómo se vende</h4><p style={mut}>"Si entras hoy con el plan anual: $169 — pagas 4.5 meses, llevas 12 — y desbloqueas todo desde el día 1." En llamada: es el downsell natural cuando el Mentorship no es fit.</p></Card>
            <Card><Pill c="red">HIGH</Pill><div style={{ fontFamily:'Archivo', fontSize:28, fontWeight:900, margin:'8px 0 4px' }}>$397–497</div><p style={mut}><strong style={{ color:'var(--txt)' }}>Project Boy Mentorship</strong> — precio de validación. 3 cursos + 1:1 WhatsApp + llamada mensual + grupales + revisión de activos. 12 semanas. Promesa: $3,000 en 90 días. 10-15 plazas.</p><h4 style={{ marginTop:12, fontSize:13 }}>Cómo se vende</h4><p style={mut}>SOLO en llamada. Bolsillo 400+ → $497; justo → $397. "Precio de cohorte fundadora; con los primeros casos sube a $997."</p></Card>
          </div>
          <div style={{ borderLeft:'3px solid var(--gold)', background:'var(--gold-dim)', padding:'13px 15px', borderRadius:'0 12px 12px 0', margin:'13px 0', fontSize:13.5 }}>
            🗺️ <strong>Roadmap (NO se vende ahora):</strong> con testimonios → Mentorship $997 · cursos sin 1:1 → upsell PBA $397-497 · herramientas $60-197.
          </div>
          <h3 style={h3}>El mate — 3 escenarios</h3>
          <Card>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead><tr style={{ borderBottom:'1px solid var(--line)' }}>{['Escenario','Anual+mensual','Mentorship','Fundador (57)','MRR','TOTAL'].map(h=><th key={h} style={{ textAlign:'left', padding:'7px 9px', color:'var(--mut)', fontSize:11, textTransform:'uppercase', letterSpacing:'.06em' }}>{h}</th>)}</tr></thead>
              <tbody>
                <tr style={{ borderBottom:'1px solid var(--line)' }}><td style={{ padding:'8px 9px' }}><Pill c="red">🔴 Piso</Pill></td><td>~$4,500</td><td>2≈$900</td><td>8≈$1,350</td><td>$654</td><td><strong>~$7,400</strong></td></tr>
                <tr style={{ borderBottom:'1px solid var(--line)', background:'var(--gold-dim)' }}><td style={{ padding:'8px 9px' }}><Pill c="amber">🟡 BASE</Pill></td><td>~$6,900</td><td>4≈$1,800</td><td>15≈$2,500</td><td>$654</td><td><strong style={{ color:'var(--gold)' }}>~$11,850</strong></td></tr>
                <tr><td style={{ padding:'8px 9px' }}><Pill c="green">🟢 Meta</Pill></td><td>~$8,500</td><td>7≈$3,100</td><td>18≈$3,000</td><td>$654</td><td><strong>~$15,300</strong></td></tr>
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ══════════════════ CAJA ══════════════════ */}
      {tab === 'caja' && (
        <div style={{ paddingTop:28 }}>
          <h2 style={{ fontFamily:'Archivo', fontSize:22, fontWeight:900 }}>Operación Caja</h2>
          <div style={{ borderLeft:'3px solid var(--gold)', background:'var(--gold-dim)', padding:'13px 15px', borderRadius:'0 12px 12px 0', margin:'13px 0', fontSize:13.5 }}>
            💵 Un lead muerto revive con <strong>información nueva</strong>: precio que sube ($397→$997), cupo que cierra, bonus que desaparece. <strong style={{ color:'var(--red)' }}>Cero DMs de oferta del 21 jun a la MC.</strong>
          </div>
          <div style={grid3}>
            <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:12, padding:14 }}><div style={mut}>Leads de trabajo</div><div style={{ fontFamily:'Archivo', fontSize:28, fontWeight:900, color:'var(--gold)' }}>39</div><div style={mut}>12 T1 · 12 T2 · 15 nuevos</div></div>
            <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:12, padding:14 }}><div style={mut}>Cash esperado pre-MC</div><div style={{ fontFamily:'Archivo', fontSize:28, fontWeight:900, color:'var(--gold)' }}>$1.9-2.9K</div></div>
            <div style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:12, padding:14 }}><div style={mut}>Lista de trabajo</div><div style={{ fontSize:13, fontWeight:700, marginTop:6 }}>operacion-caja-lista-marce.xlsx</div><div style={mut}>Mensajes palabra por palabra</div></div>
          </div>
          <h3 style={h3}>Track A — 4 toques (lun 16 - lun 23)</h3>
          <Card>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead><tr style={{ borderBottom:'1px solid var(--line)' }}>{['Toque','Día','Qué se dice'].map(h=><th key={h} style={{ textAlign:'left', padding:'7px 9px', color:'var(--mut)', fontSize:11, textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
              <tbody>
                {[['T1','Lun 16','Pregunta binaria sin pitch: "¿Sigues queriendo facturar $3,000 o ya lo dejaste?"'],['T2','Mié 18','Info nueva: cohorte fundadora $397-497 antes de $997 + nombrar SU objeción del historial'],['T3','Vie 20','Prueba + plan de pagos + "te digo derecho si es para ti"'],['T4','Lun 23','Cierre de ciclo — un no también cierra en paz']].map(([t,d,m])=>(
                  <tr key={t} style={{ borderBottom:'1px solid var(--line)' }}>
                    <td style={{ padding:'8px 9px', fontWeight:700 }}>{t}</td><td style={{ padding:'8px 9px' }}>{d}</td><td style={{ padding:'8px 9px' }}>{m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ ...mut, marginTop:8 }}>No al mid → <strong style={{ color:'var(--txt)' }}>downsell al anual $169 en el mismo chat.</strong></div>
          </Card>
          <h3 style={h3}>🔥 Tier 1 — llamada Mentorship (12)</h3>
          <Card>
            <p><Pill c="red">PRIMERO</Pill> <strong> alex (ES)</strong> — RE-APLICÓ con bolsillo 250-400: ya domina Brand Architect, solo le faltan clientes.</p>
            <p style={{ ...mut, marginTop:6 }}>Jaden MX · Carlos J1Kl2MJ · Luis Edu Sonora · Fernando · Gia PE ($400 generados) · José MX · Nacho ES (el abuelo al Camp Nou) · Néstor PR ("no busco inspiración, busco resultados") · Carlos 7XX9099 · Pablo PE · leonel ("cansado de ser mediocre").</p>
          </Card>
          <h3 style={h3}>🆕 Nuevos form junio (15) — EN CALIENTE lun 16-mié 18</h3>
          <Card>
            <p>🅰️ A llamada: <strong>Benjamin Fuentes (CL, 500-1000 💰 el bolsillo más alto)</strong> · Nicolas PE · Edgar MX · Carlos Gandara (+26, con negocio).</p>
            <p style={{ ...mut, marginTop:6 }}>🅱️ DM doble puerta: Matheo AR (re-aplicó) · Matías Ramón (3 aplicaciones — describió PBA como su solución ideal) · Jhailander · Adriel · David Torner · Samuel León · Danniel Gil (su pregunta = Reel 📹) · Brayan · Mateo Luna · Charly · Henry Loor.</p>
          </Card>
        </div>
      )}

      {/* ══════════════════ CONTENIDO ══════════════════ */}
      {tab === 'contenido' && (
        <div style={{ paddingTop:28 }}>
          <h2 style={{ fontFamily:'Archivo', fontSize:22, fontWeight:900 }}>Contenido & Stories</h2>
          <h3 style={h3}>Regla por pilar</h3>
          <Card>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead><tr style={{ borderBottom:'1px solid var(--line)' }}>{['Pilar','¿Dolor?','Trabajo'].map(h=><th key={h} style={{ textAlign:'left', padding:'7px 9px', color:'var(--mut)', fontSize:11, textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
              <tbody>
                <tr style={{ borderBottom:'1px solid var(--line)' }}><td style={{ padding:'8px 9px' }}>🩹 Conexión</td><td>✅</td><td>Toca la herida → mueve al curso gratis</td></tr>
                <tr style={{ borderBottom:'1px solid var(--line)' }}><td style={{ padding:'8px 9px' }}>🩹 Autoridad</td><td>✅</td><td>El dolor es el setup, tú eres el payoff</td></tr>
                <tr><td style={{ padding:'8px 9px' }}>🔥 Viral</td><td>❌</td><td>Hook amplio, alcance frío, libre — trae ojos nuevos</td></tr>
              </tbody>
            </table>
          </Card>
          <h3 style={h3}>Objetivo por fase (dicta el guion del día)</h3>
          <Card>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead><tr style={{ borderBottom:'1px solid var(--line)' }}>{['Fase','Conciencia','Objetivo','CTA'].map(h=><th key={h} style={{ textAlign:'left', padding:'7px 9px', color:'var(--mut)', fontSize:11, textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
              <tbody>
                {[['F1 (13-18)','0→1','Romper la ilusión, abrir la herida','→ Curso "REALIDAD"'],['F2a (19-28)','1→2','Historia + autoridad de operador','→ Curso'],['F2b (29-3 jul)','2→3','Técnico + hype','→ Waitlist'],['MC+F3 (4-12)','3→4','Prueba social + urgencia','→ Venta "ENTRAR"']].map(r=>(
                  <tr key={r[0]} style={{ borderBottom:'1px solid var(--line)' }}>
                    {r.map((c,i)=><td key={i} style={{ padding:'8px 9px' }}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <div style={{ borderLeft:'3px solid var(--gold)', background:'var(--gold-dim)', padding:'13px 15px', borderRadius:'0 12px 12px 0', margin:'13px 0', fontSize:13.5 }}>
            ✍️ <strong>Flujo de producción (15-20 min):</strong> 1) Abre HOY → mira pieza + pilar + fase → 2) <code>idea-machine</code>: "dame idea para [pieza], pilar [X], objetivo [fase]" → 3) <code>script-master</code>: "guion grabable, CTA [Y]" → 4) Grabas → 5) José edita. 1 grabación = Reel + TikTok + frase a story.
          </div>
          <h3 style={h3}>Pipeline YouTube — Regla 96 hrs</h3>
          <Card>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead><tr style={{ borderBottom:'1px solid var(--line)' }}>{['Sube','Video','Se graba','A David'].map(h=><th key={h} style={{ textAlign:'left', padding:'7px 9px', color:'var(--mut)', fontSize:11, textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
              <tbody>
                {[['Sáb 13','Cómo progresar más rápido que el 98%','Hoy/sáb AM','Urgente'],['Lun 15','Adicto al celular','Este fin','Dom'],['Vie 19','Cuando te interesa todo','Este fin','Dom-lun'],['Sem 22-26','Procrastinas + 10x dinero joven','Fin 20-21','Dom 21'],['30 jun-3 jul','3-4 largos de nutrición (ya grabados el 20-21)','FIN 20-21 ✅','Dom 21 — 8+ días']].map((r,i)=>(
                  <tr key={i} style={{ borderBottom:'1px solid var(--line)', background: i===4 ? 'var(--gold-dim)' : 'transparent' }}>
                    {r.map((c,j)=><td key={j} style={{ padding:'8px 9px' }}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ ...mut, marginTop:8 }}>Válvula: si el domingo salió 1 de 2, el del viernes se graba el miércoles. Sin culpa.</div>
          </Card>
        </div>
      )}

      {/* ══════════════════ PLAYBOOKS ══════════════════ */}
      {tab === 'playbooks' && (
        <div style={{ paddingTop:28 }}>
          <h2 style={{ fontFamily:'Archivo', fontSize:22, fontWeight:900 }}>Playbooks</h2>

          {[
            { title:'📞 Llamada de Mentorship — guion con árbol', content: <>
              <p><strong>Apertura (2 min):</strong> "Vi tu form / nuestra conversación. Antes de contarte nada, quiero entender dónde estás." Crea contexto, NO pitches en frío.</p>
              <p style={{ marginTop:8 }}><strong>Calificación (4 preguntas):</strong> 1) ¿Qué has intentado hasta hoy? 2) ¿Has facturado algo, aunque sean $50? 3) ¿Cuánto tienes disponible para invertir? 4) ¿Qué tan en serio vas, 1-10?</p>
              <p style={{ marginTop:8 }}><strong>Árbol:</strong> facturó algo O hambre 8+ con bolsillo → pitch Mentorship (400+ = $497; justo = $397). No califica → anual $169 directo, sin rodeo.</p>
              <p style={{ marginTop:8 }}><strong>El pitch (90 seg):</strong> promesa ($3,000 en 90 días) → vehículo (3 cursos + 1:1 contigo 12 semanas) → motivo del precio (cohorte fundadora, sube a $997 con los primeros casos) → garantía de claridad 14 días → "¿Te metemos?"</p>
              <p style={{ marginTop:8 }}><strong>Objeciones:</strong> dinero → plan de pagos / downsell anual · papás → "agenda con ellos presentes, yo les explico" · "lo pienso" → "¿qué te falta saber para decidir hoy?" · no es fit → se dice derecho. La congruencia vende el lanzamiento 2.</p>
            </> },
            { title:'🎤 Masterclass hora por hora (sáb 4 jul)', content: <>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <tbody>
                  {[['08:00','WPP: "Hoy es el día" — acomoden horarios, sala con límite'],['09-11','Repaso de slides + prueba técnica del live (audio, pantalla, link)'],['11:00','WPP: ultimátum — modo avión, papel y pluma · Stories: "faltan 4 horas"'],['11:45','WPP + stories: 🔴 link del live'],['12:00 MC','Ecosistema 90 Días → tour Academy → ANUAL PRIMERO con bonus → mensual plan B → Mentorship: "aplica por DM"'],['Post','WPP gratitud · Stories screenshots del live + entradas · Marce: arranca setting de DMs']].map(([t,v])=>(
                    <tr key={t} style={{ borderBottom:'1px solid var(--line)' }}>
                      <td style={{ padding:'8px 9px', fontWeight:700, whiteSpace:'nowrap' }}>{t}</td>
                      <td style={{ padding:'8px 9px' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </> },
            { title:'📉 Ad muerto + semana 3 floja', content: <>
              <p><strong>Ad muerto:</strong> 3 días con CPL &gt;$1.50 = apagado, budget al ⭐. Los ángulos ⭐ dictan el batch 2 y los Shorts.</p>
              <p style={{ marginTop:8 }}><strong>Semana 3 abajo del base:</strong> 1) segunda pasada de llamadas a los 🟢, 2) push extra de migración anual a los 57, 3) clips de los largos como Reels extra. NO bajar el precio — subir la prueba.</p>
            </> },
            { title:'🆘 Si un día se cae (examen, imprevisto, TeensClub explota)', content: <>
              <p style={{ color:'var(--mut)' }}>Prioridad de rescate: 1) el mensaje de WhatsApp del día (5 min — NUNCA se cae, es el curso que prometiste) → 2) las stories (10 min) → 3) el Reel (puede correrse 1 día) → 4) YouTube tiene buffer de 96 hrs, no se toca. Si se cayeron 2+ días: recorta Reels, jamás el WPP.</p>
            </> },
          ].map(({ title, content }) => (
            <details key={title} style={{ background:'var(--panel)', border:'1px solid var(--line)', borderRadius:14, marginBottom:11, overflow:'hidden' }}>
              <summary style={{ cursor:'pointer', padding:'14px 18px', fontFamily:'Archivo', fontWeight:700, fontSize:14.5, listStyle:'none', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                {title} <span style={{ color:'var(--gold)', fontSize:19 }}>+</span>
              </summary>
              <div style={{ padding:'0 18px 18px' }}>{content}</div>
            </details>
          ))}

          <div style={{ borderLeft:'3px solid var(--gold)', background:'var(--gold-dim)', padding:'13px 15px', borderRadius:'0 12px 12px 0', margin:'13px 0', fontSize:13.5 }}>
            🙏 <em>"Todo lo que te venga a la mano para hacer, hazlo según tus fuerzas."</em> — Eclesiastés 9:10. Ejecuta el día que tienes enfrente; Dios se encarga del resto del calendario. Ardo sin gritar. 🦁
          </div>
        </div>
      )}

      <div style={{ marginTop:55, color:'var(--mut)', fontSize:12, textAlign:'center' }}>
        Centro de Mando PBA v5 · 12 jun 2026 · sincronizado vía Vercel KV
      </div>
    </div>
  )
}
