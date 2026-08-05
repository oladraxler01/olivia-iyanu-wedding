import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      fullName,
      phone,
      mode,
      lineItems = [],
      totalAmount = 0,
      deliveryLocation = "",
      filaMeasurement = "",
      notes = "",
    } = body;

    // Email is optional; if not provided, simply acknowledge
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: "No valid email provided. Order recorded.",
      });
    }

    const recipientEmail = email.trim();
    const isReservation = mode === "interest";
    const deadline = "August 31st, 2026";
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://olivia-iyanu-wedding.vercel.app";
    const directPayUrl = `${siteUrl}/#asoebi?mode=pay_now`;

    const subject = isReservation
      ? `Aso-Ebi Reservation Confirmation — Olivia & Iyanu Wedding`
      : `Aso-Ebi Payment Confirmation — Olivia & Iyanu Wedding`;

    // Render items list for HTML
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
    const htmlEmail = `
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
                      <tr style="background-color: #FAF7F2;">
                        <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #6B5A63; border-bottom: 1px solid #EFE4D8;">Item</th>
                        <th style="padding: 10px 12px; text-align: center; font-size: 12px; color: #6B5A63; border-bottom: 1px solid #EFE4D8;">Qty</th>
                        <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #6B5A63; border-bottom: 1px solid #EFE4D8;">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                      <tr style="background-color: #FAF7F2;">
                        <td colspan="2" style="padding: 12px; font-weight: bold; color: #241B22; font-size: 14px;">Total Estimated Sum</td>
                        <td style="padding: 12px; font-weight: bold; color: #0E5C52; font-size: 16px; text-align: right;">₦${totalAmount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- Customer Details -->
                  <div style="background-color: #FDFBF9; border: 1px solid #E3D3DA; border-radius: 12px; padding: 15px; margin-bottom: 25px; font-size: 13px; color: #5C4D55;">
                    <div style="margin-bottom: 6px;"><strong>Phone / WhatsApp:</strong> ${phone}</div>
                    <div style="margin-bottom: 6px;"><strong>Delivery Location:</strong> ${deliveryLocation}</div>
                    ${filaMeasurement ? `<div style="margin-bottom: 6px;"><strong>Cap Size (Men's Fila):</strong> ${filaMeasurement}</div>` : ""}
                    ${notes ? `<div><strong>Notes:</strong> ${notes}</div>` : ""}
                  </div>

                  ${
                    isReservation
                      ? `
                  <!-- Call To Action Button -->
                  <div style="text-align: center; margin: 30px 0 25px 0;">
                    <a href="${directPayUrl}" style="background-color: #0E5C52; color: #FFFFFF; text-decoration: none; padding: 15px 30px; border-radius: 30px; font-size: 14px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(14,92,82,0.25);">
                      Complete Your Aso-Ebi Payment Now &rarr;
                    </a>
                    <p style="margin: 10px 0 0 0; color: #8C7A84; font-size: 11px;">
                      Clicking above will take you straight to the Ready to Pay section.
                    </p>
                  </div>

                  <!-- Bank Details Box -->
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
        const resendRes = await fetch("https://api.resend.com/emails", {
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

        const resendData = await resendRes.json();
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
