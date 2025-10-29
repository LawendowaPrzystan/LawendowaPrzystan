document.addEventListener("DOMContentLoaded", function () {
        var startDate = null;
        var endDate = null;
        var datesInput = document.getElementById("datesInput");

        var calendarEl = document.getElementById("reservation-calendar");

        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: "dayGridMonth",
          locale: "pl",
          headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "",
          },
          buttonText: {
            today: "Dzisiaj",
          },
          selectable: false,
          events: "/data/bookings.json",
          eventColor: "#7E5E9C",
          eventTextColor: "#fff",
          displayEventTime: false,

          validRange: function (nowDate) {
            var today = new Date();
            today.setDate(today.getDate());
            return { start: today.toISOString().split("T")[0] };
          },
        });

        calendar.render();

        calendarEl.addEventListener("click", function (e) {
          var dayEl = e.target.closest(".fc-daygrid-day");
          if (!dayEl) return;

          var clickedDate = dayEl.getAttribute("data-date");
          var clickObj = new Date(clickedDate);

          var tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate());
          if (clickObj < tomorrow) {
            alert("Nie możesz rezerwować na dzisiaj ani w przeszłości.");
            return;
          }

          var isInsideBooked = calendar.getEvents().some(function (ev) {
            if (!ev.start || !ev.end) return false;
            var evStart = new Date(ev.start);
            var evEnd = new Date(ev.end);
            evEnd.setDate(evEnd.getDate() - 1);
            return clickObj > evStart && clickObj < evEnd;
          });

          if (isInsideBooked) {
            alert("Ten dzień jest już w trakcie rezerwacji. Wybierz inny.");
            return;
          }

          if (!startDate) {
            startDate = clickedDate;
            datesInput.value = startDate;
            highlightDay(startDate, null);
          } else if (!endDate) {
            if (clickObj < new Date(startDate)) {
              endDate = startDate;
              startDate = clickedDate;
            } else {
              endDate = clickedDate;
            }

            var diffDays =
              (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
            if (diffDays < 2) {
              alert("Minimalny pobyt to 2 noce. Wybierz późniejszy dzień.");
              startDate = null;
              endDate = null;
              datesInput.value = "";
              highlightDay(null, null);
              return;
            }

            var conflict = calendar.getEvents().some(function (ev) {
              if (!ev.start || !ev.end) return false;
              var evStart = new Date(ev.start);
              var evEnd = new Date(ev.end);
              evEnd.setDate(evEnd.getDate() - 1);

              var startObj = new Date(startDate);
              var endObj = new Date(endDate);

              return (
                startObj < evEnd &&
                endObj > evStart &&
                !(
                  endObj.getTime() === evStart.getTime() ||
                  startObj.getTime() === evEnd.getTime()
                )
              );
            });

            if (conflict) {
              alert(
                "Wybrany zakres koliduje z istniejącymi rezerwacjami. Wybierz inne daty."
              );
              startDate = null;
              endDate = null;
              datesInput.value = "";
              highlightDay(null, null);
              return;
            }

            datesInput.value = startDate + " - " + endDate;
            highlightDay(startDate, endDate);

            startDate = null;
            endDate = null;
          }
        });

        function highlightDay(start, end) {
          calendar.getEvents().forEach((ev) => {
            if (ev.display === "background") ev.remove();
          });

          if (!start) return;

          if (!end) {
            calendar.addEvent({
              start: start,
              end: start,
              display: "background",
              backgroundColor: "#BDA0CB",
            });
          } else {
            var startObj = new Date(start);
            var endObj = new Date(end);
            endObj.setDate(endObj.getDate() + 1);
            calendar.addEvent({
              start: startObj.toISOString().split("T")[0],
              end: endObj.toISOString().split("T")[0],
              display: "background",
              backgroundColor: "#BDA0CB",
            });
          }
        }
      });