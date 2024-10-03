import React, { useState, useEffect } from "react"; // Thêm useState và useEffect vào đây
import { useNavigate } from "react-router-dom";
import { listInstruments, updateInstrument } from "../../service/InstrumentService";

const InstrumentList = ({ instruments, onUpdate }) => {
  const navigator = useNavigate();
  const [instrumentList, setInstruments] = useState([]);

  useEffect(() => {
    listInstruments()
      .then((response) => {
        setInstruments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching instruments", error);
        setInstruments([]);
      });
  }, []);

  function uploadInstrument(id) {
    navigator(`/edit-instrument/${id}`);
  }

  function removeInstrument(id) {
    const insToUpdate = instruments.find((ins) => ins.id === id);
    const updatedStatus = !insToUpdate.status;

    updateInstrument({ ...insToUpdate, status: updatedStatus }, id)
      .then(() => {
        onUpdate();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <table className="table table-striped table-hover">

              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="10" className="text-center">No instruments available.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default InstrumentList;
