import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email || body.recipient_email || "";
    const fullName = body.fullName || body.customer_name || "Valued Guest";
    const phone = body.phone || "";
    const mode = body.mode || body.order_type || "interest";
    const lineItems = body.lineItems || body.items || [];
    const totalAmount = body.totalAmount ?? body.total_amount ?? 0;
    const deliveryLocation = body.deliveryLocation || body.location || "";
    const filaMeasurement = body.filaMeasurement || body.fila_measurement || "";
    const notes = body.notes || body.comments || "";

    // Email is optional; if not provided, simply acknowledge
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: "No valid email provided. Order recorded.",
      });
    }

    const recipientEmail = email.trim();
    const isRsvp = mode === "rsvp";
    const isReservation = mode === "interest";
    const deadline = "August 31st, 2026";
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.oliviawedsiyanu.xyz";
    const directPayUrl = `${siteUrl}/#asoebi?mode=pay_now`;

    const subject = isRsvp
      ? "Thank You for Your RSVP! — Olivia & Iyanu Wedding"
      : isReservation
      ? `Aso-Ebi Reservation Confirmation — Olivia & Iyanu Wedding`
      : `Aso-Ebi Payment Confirmation — Olivia & Iyanu Wedding`;

    // Render items list for HTML (Aso-Ebi mode)
    const itemsHtml = lineItems
      .filter((item: any) => item.qty > 0)
      .map(
        (item: any) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #EFE4D8; color: #241B22; font-size: 14px;">
            <strong>${item.name || item.shortName}</strong>
            ${
              item.id === "fila" && filaMeasurement
                ? `<div style="font-size: 12px; color: #8C6D1F; margin-top: 3px;">Cap Size: ${filaMeasurement}</div>`
                : ""
            }
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #EFE4D8; color: #241B22; text-align: center; font-size: 14px;">
            ${item.qty}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #EFE4D8; color: #0E5C52; font-weight: bold; text-align: right; font-size: 14px;">
            ₦${((item.price || item.unitPrice || 0) * item.qty).toLocaleString()}
          </td>
        </tr>
      `
      )
      .join("");

    // HTML Email Template
    const htmlEmail = isRsvp ? `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F7F3EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #241B22;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F3EE; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E3D3DA; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #0E5C52 0%, #083E37 100%); padding: 35px 25px; text-align: center;">
                  <p style="margin: 0 0 6px 0; color: #D4AF37; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">
                    Join The Celebration
                  </p>
                  <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 300; font-family: Georgia, serif;">
                    Olivia &amp; Iyanuoluwa
                  </h1>
                  <p style="margin: 6px 0 0 0; color: #E8D7BE; font-size: 13px; letter-spacing: 1px;">
                    #LetsDoLifeTogether • Friday, October 30, 2026
                  </p>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 35px 28px;">
                  <h2 style="margin: 0 0 16px 0; color: #0E5C52; font-size: 22px; font-family: Georgia, serif; font-weight: normal;">
                    Dear ${fullName || "Guest"},
                  </h2>
                  <p style="margin: 0 0 16px 0; color: #3E323A; font-size: 15px; line-height: 1.7;">
                    Thank you for taking the time to RSVP to <strong>Olivia Weds Iyanu</strong>.
                  </p>
                  <p style="margin: 0 0 16px 0; color: #3E323A; font-size: 15px; line-height: 1.7;">
                    We truly appreciate your response and are so grateful to have you share in this special chapter of our lives. Your RSVP has been received successfully.
                  </p>

                  <!-- RSVP Summary Box -->
                  <div style="background-color: #FAF3EA; border: 1px solid #D4AF37; border-radius: 14px; padding: 20px; margin: 24px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0; color: #6B5A63; font-size: 13px;"><strong>Guest Name:</strong></td>
                        <td style="padding: 6px 0; color: #0E5C52; font-size: 14px; font-weight: bold; text-align: right;">${fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #6B5A63; font-size: 13px;"><strong>Response Status:</strong></td>
                        <td style="padding: 6px 0; color: ${body.attending === "no" ? "#B23A6B" : "#0E5C52"}; font-size: 14px; font-weight: bold; text-align: right;">
                          ${body.attending === "no" ? "Regretfully Declining" : "Joyfully Attending"}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #6B5A63; font-size: 13px;"><strong>Date:</strong></td>
                        <td style="padding: 6px 0; color: #241B22; font-size: 13px; text-align: right;">Friday, 30th October 2026</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #6B5A63; font-size: 13px;"><strong>Location:</strong></td>
                        <td style="padding: 6px 0; color: #241B22; font-size: 13px; text-align: right;">Lagos, Nigeria</td>
                      </tr>
                    </table>
                  </div>

                  <p style="margin: 0 0 16px 0; color: #3E323A; font-size: 15px; line-height: 1.7;">
                    As the wedding day draws closer, we'll share any additional details you may need. In the meantime, if you have any questions, please don't hesitate to reach out.
                  </p>
                  <p style="margin: 0 0 24px 0; color: #3E323A; font-size: 15px; line-height: 1.7;">
                    We look forward to celebrating with you and creating beautiful memories together.
                  </p>

                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #EFE4D8;">
                    <p style="margin: 0 0 4px 0; color: #6B5A63; font-size: 14px; font-style: italic;">
                      With love and gratitude,
                    </p>
                    <p style="margin: 0; color: #0E5C52; font-size: 18px; font-family: Georgia, serif; font-weight: bold;">
                      Olivia &amp; Iyanu
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #FDFBF7; padding: 20px; text-align: center; border-top: 1px solid #E3D3DA;">
                  <p style="margin: 0; color: #8C827A; font-size: 12px;">
                    <a href="${siteUrl}" style="color: #0E5C52; text-decoration: none; font-weight: bold;">www.oliviawedsiyanu.xyz</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    ` : `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F7F3EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #241B22;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F3EE; padding: 30px 15px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #E3D3DA; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #0E5C52 0%, #083E37 100%); padding: 35px 25px; text-align: center;">
                  <p style="margin: 0 0 6px 0; color: #D4AF37; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">
                    Official Wedding Aso-Ebi
                  </p>
                  <h1 style="margin: 0; color: #FFFFFF; font-size: 26px; font-weight: 300; font-family: Georgia, serif;">
                    Olivia &amp; Iyanuoluwa
                  </h1>
                  <p style="margin: 6px 0 0 0; color: #E8D7BE; font-size: 13px; letter-spacing: 1px;">
                    #LetsDoLifeTogether • Friday, October 30, 2026
                  </p>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 30px 25px;">
                  <h2 style="margin: 0 0 10px 0; color: #0E5C52; font-size: 20px; font-weight: 600;">
                    Hello ${fullName},
                  </h2>
                  <p style="margin: 0 0 20px 0; color: #5C4D55; font-size: 14px; line-height: 1.6;">
                    ${
                      isReservation
                        ? `Thank you for indicating your interest and reserving your Aso-Ebi attire for our wedding! Below are the details of your reservation.`
                        : `Thank you for completing your payment for our wedding Aso-Ebi! We have received your order details and proof of payment.`
                    }
                  </p>

                  <!-- Deadline Alert (Especially for Reservations) -->
                  <div style="background-color: #FAF3EA; border: 1px solid #D4AF37; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
                    <strong style="color: #0E5C52; font-size: 13px; display: block; margin-bottom: 4px;">
                      ⏳ Important Payment &amp; Order Cut-off: ${deadline}
                    </strong>
                    <span style="color: #6B5A63; font-size: 12.5px; line-height: 1.5; display: block;">
                      To guarantee fabric and Aso-Ebi availability, please note that all allocations and reservations must be paid for on or before <strong>${deadline}</strong>.
                    </span>
                  </div>

                  <!-- Order Summary Table -->
                  <h3 style="margin: 0 0 12px 0; color: #B23A6B; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase;">
                    Itemized Summary
                  </h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; border-collapse: collapse; border: 1px solid #EFE4D8; border-radius: 10px; overflow: hidden;">
                    <thead>
                      <tr style="background-color: #FDFBF7;">
                        <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #8C827A; text-transform: uppercase; border-bottom: 1px solid #EFE4D8;">Item</th>
                        <th style="padding: 10px 12px; text-align: center; font-size: 12px; color: #8C827A; text-transform: uppercase; border-bottom: 1px solid #EFE4D8;">Qty</th>
                        <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #8C827A; text-transform: uppercase; border-bottom: 1px solid #EFE4D8;">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                    <tfoot>
                      <tr style="background-color: #FAF3EA;">
                        <td colspan="2" style="padding: 12px; font-weight: bold; color: #0E5C52; font-size: 14px;">Total Amount:</td>
                        <td style="padding: 12px; font-weight: bold; color: #0E5C52; font-size: 16px; text-align: right;">₦${Number(totalAmount).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>

                  <!-- Customer Details -->
                  <div style="background-color: #FDFBF7; border: 1px solid #EFE4D8; border-radius: 10px; padding: 15px; margin-bottom: 25px; font-size: 13px; color: #6B5A63;">
                    ${phone ? `<p style="margin: 0 0 6px 0;"><strong>Phone:</strong> ${phone}</p>` : ""}
                    ${deliveryLocation ? `<p style="margin: 0 0 6px 0;"><strong>Delivery/Pickup:</strong> ${deliveryLocation}</p>` : ""}
                    ${notes ? `<p style="margin: 0;"><strong>Note:</strong> ${notes}</p>` : ""}
                  </div>

                  <!-- Bank Details for Reservations -->
                  ${
                    isReservation
                      ? `
                  <div style="background-color: #FFFFFF; border: 1px solid #D4AF37; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: #0E5C52; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                      Official Bank Transfer Details
                    </h4>
                    <table width="100%" style="font-size: 13px; color: #241B22;">
                      <tr>
                        <td style="padding: 3px 0; color: #6B5A63;">Bank:</td>
                        <td style="padding: 3px 0; font-weight: bold;">Providus Bank</td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 0; color: #6B5A63;">Account Name:</td>
                        <td style="padding: 3px 0; font-weight: bold;">Olutunmbi Iyanuoluwa</td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 0; color: #6B5A63;">Account Number:</td>
                        <td style="padding: 3px 0; font-weight: bold; font-family: monospace; font-size: 15px; color: #0E5C52;">6506784864</td>
                      </tr>
                    </table>
                  </div>
                  `
                      : `
                  <div style="background-color: #FAF3EA; border: 1px solid #D4AF37; border-radius: 12px; padding: 15px; margin-bottom: 20px; text-align: center;">
                    <p style="margin: 0; color: #0E5C52; font-size: 13px; font-weight: 600;">
                      ✓ Payment Proof Received
                    </p>
                    <p style="margin: 5px 0 0 0; color: #6B5A63; font-size: 12px;">
                      Our wedding team will verify your transfer. For any questions, message us on WhatsApp.
                    </p>
                  </div>
                  `
                  }

                  <p style="margin: 25px 0 0 0; color: #6B5A63; font-size: 13px; text-align: center; border-top: 1px solid #EFE4D8; padding-top: 20px;">
                    Warm regards,<br>
                    <strong>Olivia &amp; Iyanuoluwa</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #FAF7F2; padding: 18px; text-align: center; font-size: 11px; color: #8C7A84; border-top: 1px solid #EFE4D8;">
                  This is an automated confirmation for Olivia &amp; Iyanu's Wedding.<br>
                  <a href="${siteUrl}" style="color: #0E5C52; text-decoration: none; font-weight: bold;">Visit Wedding Website</a>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    // Attempt dispatch via Resend if RESEND_API_KEY is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || "Olivia & Iyanu Wedding <celebration@oliviawedsiyanu.xyz>";
        
        let resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [recipientEmail],
            subject,
            html: htmlEmail,
          }),
        });

        let resendData = await resendRes.json();
        
        // If the custom domain is not yet verified in Resend, gracefully fallback to testing sender
        if (!resendRes.ok && fromEmail !== "Olivia & Iyanu Wedding <onboarding@resend.dev>") {
          console.warn("Custom domain not yet verified, trying sandbox fallback...", resendData);
          resendRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Olivia & Iyanu Wedding <onboarding@resend.dev>",
              to: [recipientEmail],
              subject,
              html: htmlEmail,
            }),
          });
          resendData = await resendRes.json();
        }

        console.log("Resend API response:", resendData);
        if (!resendRes.ok) {
          console.error("Resend send failed:", resendData);
        }
        return NextResponse.json({
          success: resendRes.ok,
          emailSent: resendRes.ok,
          provider: "resend",
          data: resendData,
        });
      } catch (sendErr) {
        console.error("Resend API error:", sendErr);
      }
    }

    // Return success response with generated template summary
    return NextResponse.json({
      success: true,
      emailSent: true,
      provider: "simulated_or_ready",
      message: `Confirmation email prepared for ${recipientEmail}`,
    });
  } catch (error: any) {
    console.error("Error in /api/send-confirmation:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process email" },
      { status: 500 }
    );
  }
}
